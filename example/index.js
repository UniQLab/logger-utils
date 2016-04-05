
const loggerFactory = require('../');
const logger = loggerFactory.createRequestsLogger('test', __dirname);
const path = require('path');

logger.info('hello world!');
logger.info('hello world2!');
logger.info('hello world3!');

const logger2 = loggerFactory.createErrorLogger(process.env.LOG || 'test', { logIntoFile: true, logIntoConsole: true });
logger2.error('hello world4!');