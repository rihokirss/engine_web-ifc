import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const api=process.env.WEB_IFC_API||fileURLToPath(new URL('../../dist/web-ifc-api-node.js',import.meta.url));
const script=`const fs=require('node:fs'),w=require(process.argv[1]);(async()=>{const api=new w.IfcAPI();await api.Init();const bytes=fs.readFileSync(process.argv[2]);const model=api.OpenModel(bytes);if(model<0)return;try{const match=bytes.toString().match(/#(\\d+)=IFCBUILDINGELEMENTPROXY/);if(match)api.GetFlatMesh(model,Number(match[1]));}finally{api.CloseModel(model);}})().catch(e=>{console.error(e);process.exitCode=1;});`;
for(const name of ['unterminated-string','unterminated-comment','invalid-index','cyclic-placement','missing-placement'])test('bounded malformed input: '+name,()=>{
 const result=spawnSync(process.execPath,['-e',script,api,fileURLToPath(new URL('./malformed-fixtures/'+name+'.ifc',import.meta.url))],{timeout:5000,maxBuffer:1024*1024,encoding:'utf8'});
 assert.equal(result.error,undefined);assert.equal(result.status,0,result.stderr);assert.doesNotMatch(result.stdout+result.stderr,/memory access out of bounds|RuntimeError|stack overflow|Aborted\(/);
});
