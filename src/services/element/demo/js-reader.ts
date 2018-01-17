import {runInContext, createContext} from 'vm';
import {readFile} from 'fs-extra';

const readFileAsync = p:string => bluebird.promisify(readFile);

export async function loadJs(path:string) : Promise<any>{
  const contents = await readFileAsync(p, 'utf8');
  const sandbox = {
    module: {}
  }
  createContext(sandbox);
  runInContext(contents, sandbox);
  return sandbox.module.exports;
}