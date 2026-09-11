import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const w=require(process.env.WEB_IFC_API||'../../dist/web-ifc-api-node.js');
const source=fs.readFileSync(new URL('./geometry-fixtures/strings-base.ifc',import.meta.url),'utf8');
for(const text of ["Don't", "Õ'", 'C:\\Models\\a.ifc', '😀', 'Õ😀ä', '\u00a0']){
 test(`strings: ${JSON.stringify(text)}`,async()=>{
  const api=new w.IfcAPI();await api.Init();
  assert.equal(api.DecodeText(api.EncodeText(text)),text);
  const input=source.replace('ENDSEC;\nEND-ISO',`#9000=IFCPROPERTYSINGLEVALUE('Audit',$,IFCTEXT('${api.EncodeText(text)}'),$);\nENDSEC;\nEND-ISO`);
  let m=api.OpenModel(new TextEncoder().encode(input));
  assert.equal(api.GetLine(m,9000).NominalValue.value,text);
  const line=api.GetLine(m,9000);line.NominalValue.value=text;api.WriteLine(m,line);
  assert.equal(api.GetLine(m,9000).NominalValue.value,text);
  const saved=api.SaveModel(m);api.CloseModel(m);m=api.OpenModel(saved);
  assert.equal(api.GetLine(m,9000).NominalValue.value,text);api.CloseModel(m);
 });
}
test('S escape: non-breaking space',async()=>{const api=new w.IfcAPI();await api.Init();assert.equal(api.DecodeText('\\S\\ '),'\u00a0');});
for(const encoded of ['\\X2\\00\\X0\\','\\X2\\D800\\X0\\','\\X4\\00110000\\X0\\','\\X2\\00','\\X2\\GGGG\\X0\\'])test('reject invalid escape '+encoded,async()=>{const api=new w.IfcAPI();await api.Init();assert.equal(api.DecodeText(encoded),'');});
