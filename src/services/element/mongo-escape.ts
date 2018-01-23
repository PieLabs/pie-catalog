import * as _ from 'lodash';
import { KeyMap } from './service';

const escapeKey = key => `_ms_${key}`;
const unescapeKey = key => key.replace('_ms_', '');

export function escape(data: KeyMap | any[]): KeyMap {

  if (Array.isArray(data)) {
    return data.map(escape)
  } else if (_.isObject(data)) {
    return _.reduce(data, (acc, value, key) => {
      if (key) {
        const finalKey = _.startsWith(key, '$') ? escapeKey(key) : key;
        acc[finalKey] = _.isObject(value) ? escape(value) : value;
      }
      return acc;
    }, {});
  } else {
    return data;
  }
}

export function unescape(data: KeyMap): KeyMap {
  if (Array.isArray(data)) {
    return data.map(unescape);
  } else if (_.isObject(data)) {
    return _.reduce(data, (acc, value, key) => {
      if (key) {
        const finalKey = _.startsWith(key, '_ms_') ? unescapeKey(key) : key;
        acc[finalKey] = _.isObject(value) ? unescape(value) : value;
      }
      return acc;
    }, {});
  } else {
    return data;
  }
}