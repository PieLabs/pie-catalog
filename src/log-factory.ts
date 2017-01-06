//TODO: lifted from pie-cli - make into a lib.

import * as winston from 'winston';
import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as stackTrace from 'stack-trace';


let config = {
  'default': 'info'
};


//levels: error > warn > info > verbose > debug > silly

export let init = (log) => {

  console.log('init: ', log);
  if (!log) {
    return;
  }
  if (_.isObject(log)) {
    setConfig(log);
  } else if (isLogLevel(log)) {
    setDefaultLevel(log);
  } else {
    try {
      let config = JSON.parse(log);
      console.log('parsed log: ', log);
      setConfig(config);
    } catch (e) {
      if (fs.existsSync(log)) {
        setConfigFromFile(log);
      } else {
        console.error('can not configure logging using cli param value: ' + log);
      }
    }
  }
};

function addLogger(label, level?: string) {

  level = level ? level : config['default'] || 'info';
  console.log('[addLogger] level: ', level);
  let cfg = mkLogConfig(label, level);
  let logger;
  if (winston.loggers.has(label)) {
    logger = winston.loggers.get(label);
  } else {
    logger = winston.loggers.add(label, {});
  }

  logger.configure(cfg);
  return logger;
}

let mkLogConfig = (label: string, level: string) => {
  return {
    level: level,
    transports: [
      new (winston.transports.Console)({ colorize: true, label: label })
    ]
  }
}

export let isLogLevel = (l) => _.includes(['error', 'warn', 'info', 'verbose', 'debug', 'silly'], l);


export let setDefaultLevel = (l) => {
  config = config || { 'default': l };
  config['default'] = l;
  _.forEach(winston.loggers.loggers, (value, key) => {
    let cfg = mkLogConfig(key, config['default']);
    value.configure(cfg);
  });
};

export let setConfigFromFile = (configPath) => {
  var cfg = fs.readJsonSync(configPath);
  console.log(cfg);
  setConfig(cfg);
};

export let setConfig = (cfg) => {
  config = _.merge({}, config, cfg);
  _.forIn(cfg, (value, key) => {
    addLogger(key, value);
  });
};

export let getLogger = (id) => {
  var existing = winston.loggers.has(id);

  if (existing) {
    return winston.loggers.get(id);
  } else {
    return addLogger(id);
  }
};

/** get a file logger */
export let fileLogger = (filename) => {
  var label;
  var parsed = path.parse(filename);

  if (parsed.name === 'index') {
    label = path.basename(parsed.dir);
  } else {
    label = parsed.name;
  }
  return getLogger(label);
}


export function buildLogger() {
  let trace = stackTrace.get();
  let name = trace[1].getFileName();
  return fileLogger(name);
}
