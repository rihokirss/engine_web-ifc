import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const W = require(process.env.WEB_IFC_API || '../../dist/web-ifc-api-node.js');

function modelBytes(schema = 'IFC4', extra = '', firstReferences = '#32,#400') {
  return new TextEncoder().encode(`ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Inverse relation regression'),'2;1');
FILE_NAME('inverse.ifc','2026-01-01T00:00:00',(''),(''),'web-ifc','web-ifc','');
FILE_SCHEMA(('${schema}'));
ENDSEC;
DATA;
#1=IFCPERSON($,$,'Test',$,$,$,$,$);
#2=IFCORGANIZATION($,'Test',$,$,$);
#3=IFCPERSONANDORGANIZATION(#1,#2,$);
#4=IFCAPPLICATION(#2,'1','Regression test','test');
#5=IFCOWNERHISTORY(#3,#4,$,.ADDED.,0,$,$,0);
#32=IFCBUILDINGELEMENTPROXY('0000000000000000000032',#5,'First',$,$,$,$,$,$);
#300=IFCPROPERTYSINGLEVALUE('Value',$,IFCLABEL('x'),$);
#301=IFCPROPERTYSET('0000000000000000000301',#5,'Pset_Test',$,(#300));
#302=IFCMATERIAL('Material'${schema === 'IFC2X3' ? '' : ',$,$'});
#303=IFCCOLOURRGB($,0.2,0.4,0.6);
#400=IFCBUILDINGELEMENTPROXY('0000000000000000000400',#5,'Second',$,$,$,$,$,$);
#500=IFCRELDEFINESBYPROPERTIES('0000000000000000000500',#5,$,$,(${firstReferences}),#301);
#501=IFCRELDEFINESBYPROPERTIES('0000000000000000000501',#5,$,$,(#32),#301);
#502=IFCRELASSOCIATESMATERIAL('0000000000000000000502',#5,$,$,(#32),#302);
${extra}
ENDSEC;
END-ISO-10303-21;`);
}

function inverse(api, model, id, types = [W.IFCRELDEFINESBYPROPERTIES], position = 4, set = true) {
  const ids = api.wasmModule.GetInversePropertyForItem(model, id, types, position, set);
  try {
    return Array.from({ length: ids.size() }, (_, index) => ids.get(index));
  } finally {
    ids.delete();
  }
}

async function withApi(action) {
  const api = new W.IfcAPI();
  await api.Init();
  api.SetLogLevel(W.LogLevel.LOG_LEVEL_OFF);
  try {
    await action(api);
  } finally {
    api.Dispose();
  }
}

test('inverse queries preserve order, cardinality and public API results across schemas', () => withApi(api => {
  for (const schema of ['IFC2X3', 'IFC4', 'IFC4X3_ADD2']) {
    const model = api.OpenModel(modelBytes(schema));
    assert.ok(model >= 0, schema);
    for (let repeat = 0; repeat < 4; repeat++) {
      assert.deepEqual(inverse(api, model, 32), [500, 501]);
      assert.deepEqual(inverse(api, model, 400), [500]);
      assert.deepEqual(inverse(api, model, 99999), []);
      assert.deepEqual(inverse(api, model, 32, [W.IFCRELASSOCIATESMATERIAL, W.IFCRELDEFINESBYPROPERTIES]), [502, 500, 501]);
      assert.deepEqual(inverse(api, model, 32, [W.IFCRELDEFINESBYPROPERTIES, W.IFCRELDEFINESBYPROPERTIES]), [500, 501, 500, 501]);
      assert.deepEqual(inverse(api, model, 32, [W.IFCRELDEFINESBYPROPERTIES], 4, false), [500]);
      assert.deepEqual(inverse(api, model, 301, [W.IFCRELDEFINESBYPROPERTIES], 5), [500, 501]);
      const item = api.GetLine(model, 32, false, true, 'IsDefinedBy');
      assert.deepEqual(item.IsDefinedBy.map(ref => ref.value), [500, 501]);
    }
    api.CloseModel(model);
  }
}));

test('inverse queries invalidate after replacing, adding and deleting relations', () => withApi(api => {
  const model = api.OpenModel(modelBytes());
  inverse(api, model, 32);
  inverse(api, model, 32);
  const relation = api.GetRawLineData(model, 500);
  relation.arguments[4] = [{ type: W.REF, value: 400 }];
  api.WriteRawLineData(model, relation);
  assert.deepEqual(inverse(api, model, 32), [501]);
  assert.deepEqual(inverse(api, model, 400), [500]);
  const extra = api.GetRawLineData(model, 501);
  extra.ID = 503;
  api.WriteRawLineData(model, extra);
  assert.deepEqual(inverse(api, model, 32), [501, 503]);
  assert.deepEqual(inverse(api, model, 32), [501, 503]);
  api.DeleteLine(model, 501);
  assert.deepEqual(inverse(api, model, 32), [503]);
  assert.deepEqual(inverse(api, model, 32), [503]);
  const saved = api.SaveModel(model);
  api.CloseModel(model);
  const reopened = api.OpenModel(saved);
  assert.deepEqual(inverse(api, reopened, 32), [503]);
  api.CloseModel(reopened);
}));

test('inverse indexes belong to one model lifetime', () => withApi(api => {
  let first = api.OpenModel(modelBytes());
  const second = api.OpenModel(modelBytes());
  for (const model of [first, second]) {
    inverse(api, model, 32);
    inverse(api, model, 32);
  }
  const relation = api.GetRawLineData(first, 500);
  relation.arguments[4] = [{ type: W.REF, value: 400 }];
  api.WriteRawLineData(first, relation);
  assert.deepEqual(inverse(api, first, 32), [501]);
  assert.deepEqual(inverse(api, second, 32), [500, 501]);
  api.CloseModel(first);
  first = api.OpenModel(modelBytes());
  assert.deepEqual(inverse(api, first, 32), [500, 501]);
  api.CloseModel(first);
  api.CloseModel(second);
}));

test('inverse queries fall back correctly after query eviction or index budget exhaustion', () => withApi(api => {
  let model = api.OpenModel(modelBytes());
  inverse(api, model, 32);
  inverse(api, model, 32);
  let queryShapes = 0;
  for (const { typeID } of api.GetAllTypesOfModel(model)) {
    const ids = api.GetLineIDsWithType(model, typeID);
    const arity = api.GetRawLineData(model, ids.get(0)).arguments.length;
    ids.delete();
    for (let position = 0; position < arity; position++) {
      inverse(api, model, 32, [typeID], position);
      inverse(api, model, 32, [typeID], position);
      queryShapes++;
    }
  }
  assert.ok(queryShapes > 64, 'exercise eviction using attributes of populated entity types');
  assert.deepEqual(inverse(api, model, 32), [500, 501]);
  api.CloseModel(model);
  const count = 300000, rows = [], references = [];
  for (let index = 0; index < count; index++) {
    const id = 1000000 + index;
    references.push('#' + id);
    rows.push(`#${id}=IFCBUILDINGELEMENTPROXY('${String(id).padStart(22, '0')}',#5,$,$,$,$,$,$,$);`);
  }
  model = api.OpenModel(modelBytes('IFC4', rows.join('\n'), references.join(',')));
  assert.ok(model >= 0);
  for (let repeat = 0; repeat < 4; repeat++) {
    assert.deepEqual(inverse(api, model, 1000000 + count - 1), [500]);
    assert.deepEqual(inverse(api, model, 32), [501]);
  }
  api.CloseModel(model);
}));
