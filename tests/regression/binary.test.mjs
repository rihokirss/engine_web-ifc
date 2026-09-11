import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),w=require(process.env.WEB_IFC_API||'../../dist/web-ifc-api-node.js');
const base=fs.readFileSync(new URL('./geometry-fixtures/strings-base.ifc',import.meta.url),'utf8');
for(const schema of ['IFC4','IFC4X3_ADD2'])test('binary pixel parse/write/save '+schema,async()=>{
 const api=new w.IfcAPI();await api.Init();const text=base.replace("FILE_SCHEMA(('IFC4'))",`FILE_SCHEMA(('${schema}'))`).replace('ENDSEC;\nEND-ISO','#9000=IFCPIXELTEXTURE(.T.,.T.,$,$,$,1,1,3,("0FF00AA"));\nENDSEC;\nEND-ISO');
 let m=api.OpenModel(new TextEncoder().encode(text));const raw=api.GetRawLineData(m,9000);assert.equal(raw.arguments.length,9);assert.equal(raw.arguments[8][0].type,11);assert.equal(raw.arguments[8][0].value,'0FF00AA');
 const row=api.GetLine(m,9000);assert.equal(row.Pixel.length,1);assert.equal(row.Pixel[0].value,'0FF00AA');row.Pixel[0].value='0ABCDEF';api.WriteLine(m,row);
 assert.equal(api.GetLine(m,9000).Pixel[0].value,'0ABCDEF');const saved=api.SaveModel(m);api.CloseModel(m);assert.match(new TextDecoder().decode(saved),/"0ABCDEF"/);m=api.OpenModel(saved);assert.equal(api.GetLine(m,9000).Pixel[0].value,'0ABCDEF');api.CloseModel(m);
});
