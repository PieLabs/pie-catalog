
const logFactory = require('../lib/log-factory');


const level = process.env['LOG_LEVEL'] || 'silly';
console.log('level: ', level);
logFactory.init('silly');