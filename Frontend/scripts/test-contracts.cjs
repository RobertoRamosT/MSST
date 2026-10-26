const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const frontend=path.resolve(__dirname,'..');
const output=process.env.MSST_TEST_OUTPUT?path.resolve(process.env.MSST_TEST_OUTPUT):fs.mkdtempSync(path.join(os.tmpdir(),'msst-angular-'));
fs.mkdirSync(output,{recursive:true});
const config={extends:path.join(frontend,'tsconfig.json'),compilerOptions:{outDir:path.join(output,'compiled'),rootDir:path.join(frontend,'src'),types:['node'],typeRoots:[path.join(frontend,'node_modules/@types')],skipLibCheck:false},angularCompilerOptions:{strictTemplates:true,strictInjectionParameters:true,compilationMode:'full'},files:[path.join(frontend,'src/app/core/services/workflow-api.service.spec.ts')],include:[]};
const configFile=path.join(output,'tsconfig.contract-tests.json');fs.writeFileSync(configFile,JSON.stringify(config,null,2));
function run(args){const result=spawnSync(process.execPath,args,{stdio:'inherit',cwd:frontend});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);}
run([path.join(frontend,'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),'-p',configFile]);
const bundle=path.join(output,'contracts.mjs');
require('esbuild').buildSync({entryPoints:[path.join(output,'compiled/app/core/services/workflow-api.service.spec.js')],outfile:bundle,bundle:true,platform:'node',format:'esm',nodePaths:[path.join(frontend,'node_modules')],banner:{js:"import {createRequire} from 'node:module';const require=createRequire(import.meta.url);"},logLevel:'warning'});
run(['--test',bundle]);
console.log('Evidencia compilada: '+output);
