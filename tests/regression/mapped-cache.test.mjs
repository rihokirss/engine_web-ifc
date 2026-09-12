import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const W = require(process.env.WEB_IFC_API || '../../dist/web-ifc-api-node.js');

function fixture() {
  const rows = [
    '#1=IFCCARTESIANPOINT((0.,0.,0.));',
    '#2=IFCAXIS2PLACEMENT3D(#1,$,$);',
    "#3=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-7,#2,$);",
    '#4=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);',
    '#5=IFCUNITASSIGNMENT((#4));',
    "#6=IFCPROJECT('0000000000000000000006',$,'Mapped geometry',$,$,$,$,(#3),#5);",
    '#7=IFCDIRECTION((0.,0.,1.));',
    '#8=IFCDIRECTION((-1.,0.,0.));',
    '#9=IFCDIRECTION((0.,1.,0.));',
    '#100=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,4.,2.);',
    '#101=IFCEXTRUDEDAREASOLID(#100,#2,#7,3.);',
    "#102=IFCSHAPEREPRESENTATION(#3,'Body','SweptSolid',(#101));",
    '#103=IFCREPRESENTATIONMAP(#2,#102);',
    '#104=IFCCARTESIANTRANSFORMATIONOPERATOR3D($,$,#1,1.,$);',
    '#105=IFCMAPPEDITEM(#103,#104);',
    "#106=IFCSHAPEREPRESENTATION(#3,'Body','MappedRepresentation',(#105));",
    '#107=IFCREPRESENTATIONMAP(#2,#106);',
    "#110=IFCCOLOURRGB($,0.2,0.4,0.6);",
    '#111=IFCSURFACESTYLESHADING(#110,0.);',
    '#112=IFCSURFACESTYLE($,.BOTH.,(#111));',
    '#113=IFCSTYLEDITEM(#101,(#112),$);',
  ];
  const ids = [];
  for (let instance = 0; instance < 4; instance++) {
    const n = 1000 + instance * 20;
    rows.push(`#${n}=IFCCARTESIANPOINT((${instance * 10}.,0.,0.));`,
      `#${n + 1}=IFCAXIS2PLACEMENT3D(#${n},$,$);`,
      `#${n + 2}=IFCLOCALPLACEMENT($,#${n + 1});`,
      `#${n + 3}=IFCCARTESIANTRANSFORMATIONOPERATOR3D(${instance % 2 ? '#8,#9' : '$,$'},#1,1.,#7);`,
      `#${n + 4}=IFCMAPPEDITEM(#107,#${n + 3});`,
      `#${n + 5}=IFCSHAPEREPRESENTATION(#3,'Body','MappedRepresentation',(#${n + 4}));`,
      `#${n + 6}=IFCPRODUCTDEFINITIONSHAPE($,$,(#${n + 5}));`,
      `#${n + 7}=IFCBUILDINGELEMENTPROXY('${String(n + 7).padStart(22, '0')}',$,'Instance',$,$,#${n + 2},#${n + 6},$,$);`);
    ids.push(n + 7);
  }
  rows.push('#2000=IFCRECTANGLEPROFILEDEF(.AREA.,$,$,1.,1.);',
    '#2001=IFCEXTRUDEDAREASOLID(#2000,#2,#7,3.);',
    "#2002=IFCSHAPEREPRESENTATION(#3,'Body','SweptSolid',(#2001));",
    '#2003=IFCPRODUCTDEFINITIONSHAPE($,$,(#2002));',
    "#2004=IFCOPENINGELEMENT('0000000000000000002004',$,'Opening',$,$,#1002,#2003,$,.OPENING.);",
    "#2005=IFCRELVOIDSELEMENT('0000000000000000002005',$,$,$,#1007,#2004);");
  const bytes = new TextEncoder().encode(`ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Mapped geometry regression'),'2;1');
FILE_NAME('mapped.ifc','2026-01-01T00:00:00',(''),(''),'web-ifc','web-ifc','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
${rows.join('\n')}
ENDSEC;
END-ISO-10303-21;`);
  return { bytes, ids };
}

function measure(api, model, mesh) {
  let volume = 0;
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  const colors = [];
  for (let part = 0; part < mesh.geometries.size(); part++) {
    const placed = mesh.geometries.get(part);
    colors.push(placed.color);
    const geometry = api.GetGeometry(model, placed.geometryExpressID);
    try {
      const vertices = api.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
      const indices = api.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());
      const matrix = placed.flatTransformation;
      const point = index => {
        assert.ok(index < vertices.length / 6);
        const xyz = Array.from({ length: 3 }, (_, axis) =>
          matrix[axis] * vertices[index * 6] + matrix[axis + 4] * vertices[index * 6 + 1]
          + matrix[axis + 8] * vertices[index * 6 + 2] + matrix[axis + 12]);
        xyz.forEach((value, axis) => {
          assert.ok(Number.isFinite(value));
          min[axis] = Math.min(min[axis], value);
          max[axis] = Math.max(max[axis], value);
        });
        return xyz;
      };
      for (let i = 0; i < indices.length; i += 3) {
        const a = point(indices[i]), b = point(indices[i + 1]), c = point(indices[i + 2]);
        volume += (a[0] * (b[1] * c[2] - b[2] * c[1])
          + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
      }
    } finally {
      geometry.delete();
    }
  }
  return { volume: Math.abs(volume), min, max, colors };
}

async function withModel(action) {
  const api = new W.IfcAPI();
  await api.Init();
  api.SetLogLevel(W.LogLevel.LOG_LEVEL_OFF);
  const { bytes, ids } = fixture();
  const model = api.OpenModel(bytes, { COORDINATE_TO_ORIGIN: false });
  try {
    await action(api, model, ids, bytes);
  } finally {
    api.CloseModel(model);
    api.Dispose();
  }
}

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-4, `${actual} != ${expected}`);

test('nested mapped instances retain independent openings and mirrored bounds', () => withModel((api, model, ids) => {
  for (let pass = 0; pass < 3; pass++) {
    const seen = [];
    api.StreamMeshes(model, ids, mesh => {
      const result = measure(api, model, mesh);
      const instance = ids.indexOf(mesh.expressID);
      near(result.volume, instance === 0 ? 21 : 24);
      near(result.min[0], instance * 10 - 2);
      near(result.max[0], instance * 10 + 2);
      // The API returns its default Y-up geometry transformation.
      near(result.min[1], 0);
      near(result.max[1], 3);
      near(result.min[2], -1);
      near(result.max[2], 1);
      seen.push(mesh.expressID);
    });
    assert.deepEqual(seen, ids);
  }
}));

test('mapped geometry and style changes during streaming invalidate cached representations', () => withModel((api, model, ids) => {
  api.StreamMeshes(model, ids, mesh => {
    const result = measure(api, model, mesh);
    const instance = ids.indexOf(mesh.expressID);
    near(result.volume, instance === 0 ? 21 : 36);
    if (instance === 0) {
      const profile = api.GetLine(model, 100);
      profile.XDim.value = 6;
      api.WriteLine(model, profile);
      const color = api.GetLine(model, 110);
      color.Red.value = 0.8;
      api.WriteLine(model, color);
    } else {
      near(result.min[0], instance * 10 - 3);
      near(result.max[0], instance * 10 + 3);
      for (const color of result.colors) near(color.x, 0.8);
    }
  });
}));

test('mapped caches remain independent across models and geometry transformations', () => withModel((api, model, ids, bytes) => {
  const second = api.OpenModel(bytes, { COORDINATE_TO_ORIGIN: false });
  try {
    api.StreamMeshes(model, ids, () => {});
    api.SetGeometryTransformation(model, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 0, 0, 1]);
    api.StreamMeshes(model, [ids[1]], mesh => near(measure(api, model, mesh).min[0], 108));
    api.StreamMeshes(second, [ids[1]], mesh => near(measure(api, second, mesh).min[0], 8));
  } finally {
    api.CloseModel(second);
  }
}));

test('the public reset clears geometry without changing the next streamed result', () => withModel((api, model, ids) => {
  assert.equal(typeof api.wasmModule.ResetCache, 'function');
  const before = [], after = [];
  api.StreamMeshes(model, ids, mesh => before.push(measure(api, model, mesh)));
  api.ResetCache(model);
  api.StreamMeshes(model, ids, mesh => after.push(measure(api, model, mesh)));
  assert.deepEqual(after, before);
}));
