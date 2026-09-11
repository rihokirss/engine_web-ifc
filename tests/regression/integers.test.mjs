import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const w=require(process.env.WEB_IFC_API||'../../dist/web-ifc-api-node.js');
const source=fs.readFileSync(new URL('./geometry-fixtures/strings-base.ifc',import.meta.url),'utf8');
for(const value of [0,2147483647,2147483648,-2147483649,9007199254740991,-9007199254740991])test('integer read/write '+value,async()=>{
 const api=new w.IfcAPI();await api.Init();
 const text=source.replace('ENDSEC;\nEND-ISO',`#9000=IFCPROPERTYSINGLEVALUE('Audit',$,IFCINTEGER(${value}),$);\nENDSEC;\nEND-ISO`);
 let m=api.OpenModel(new TextEncoder().encode(text));let p=api.GetLine(m,9000);assert.equal(p.NominalValue.value,value);
 p.NominalValue.value=-value;api.WriteLine(m,p);assert.equal(api.GetLine(m,9000).NominalValue.value,-value||0);
 const saved=api.SaveModel(m);api.CloseModel(m);m=api.OpenModel(saved);assert.equal(api.GetLine(m,9000).NominalValue.value,-value||0);api.CloseModel(m);
});
