
const loggerFactory = require('../');
const logger = loggerFactory.createErrorLogger('test');
const path = require('path');

logger.debug('hello world!');
logger.info('hello world2!');
logger.error('hello world3!');


const logger2 = loggerFactory.createErrorLogger('test', { pathToLogsFolder: __dirname, logIntoFile: true, logIntoConsole: true });
logger2.error('hello world4!');