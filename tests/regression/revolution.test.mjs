import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {IfcAPI,LogLevel}=require(process.env.WEB_IFC_API || '../../dist/web-ifc-api-node.js');
const source=fs.readFileSync(new URL('./geometry-fixtures/ifc4-revolve-1.57.ifc',import.meta.url),'utf8');

async function check(text,expected) {
    const api=new IfcAPI();await api.Init();api.SetLogLevel(LogLevel.LOG_LEVEL_OFF);
    const model=api.OpenModel(new TextEncoder().encode(text),{CIRCLE_SEGMENTS:96});
    try {
        const product=Number(text.match(/#(\d+)=IFCBUILDINGELEMENTPROXY/)[1]);
        const mesh=api.GetFlatMesh(model,product);let volume=0,triangles=0;
        const edges=new Map();
        for(let k=0;k<mesh.geometries.size();k++) {
            const g=api.GetGeometry(model,mesh.geometries.get(k).geometryExpressID);
            const v=api.GetVertexArray(g.GetVertexData(),g.GetVertexDataSize());
            const indices=api.GetIndexArray(g.GetIndexData(),g.GetIndexDataSize());
            for(let i=0;i<indices.length;i+=3){
                const p=Array.from(indices.slice(i,i+3),j=>Array.from(v.slice(j*6,j*6+3)));
                assert.ok(p.flat().every(Number.isFinite));const [a,b,c]=p;
                volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
                const ids=p.map(a=>a.map(x=>Math.round(x*1e6)).join(','));
                for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3];assert.notEqual(a,b);const key=[a,b].sort().join('|');const e=edges.get(key)||[0,0];e[0]++;e[1]+=a<b?1:-1;edges.set(key,e);}
                triangles++;
            }
            g.delete();
        }
        assert.ok(triangles>0,'geometry must be present');
        assert.ok(Math.abs(Math.abs(volume)-expected)<expected*.01,`volume ${Math.abs(volume)}, expected ${expected}`);
        assert.ok([...edges.values()].every(([count,winding])=>count===2&&winding===0),'closed mesh with consistent winding');
    } finally {api.CloseModel(model);}
}

test('revolution: quarter turn',async()=>check(source,3*Math.PI));
test('revolution: full turn',async()=>check(fs.readFileSync(new URL('./geometry-fixtures/ifc4-revolve-6.28.ifc',import.meta.url),'utf8'),12*Math.PI));
test('revolution: reversed axis',async()=>check(source.replace('IFCDIRECTION((0.,1.,0.))','IFCDIRECTION((0.,-1.,0.))'),3*Math.PI));
