import * as _ from 'lodash';
import {KeyMap} from './service';

const escapeKey = key => `_ms_${key}`;
const unescapeKey = key => key.replace('_ms_', '');

export function escape(data: KeyMap): KeyMap {
  return _.reduce(data, (acc, value, key) => {
    if(key){
      const finalKey = key.startsWith('$') ? escapeKey(key) : key;
      acc[finalKey] = _.isObject(value) ? escape(value) : value;
    }
    return acc;
  }, {});
}

export function  unescape(data: KeyMap): KeyMap {
  return _.reduce(data, (acc, value, key) => {
    if(key) {
      const finalKey = key.startsWith('_ms_') ? unescapeKey(key) : key;
      acc[finalKey] = _.isObject(value) ? unescape(value) : value;
    }
    return acc;
  }, {});
}