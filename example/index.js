'use strict';

const loggerFactory = require('../');
const logger = loggerFactory.createError('test', { pathToLogsFolder: __dirname, logIntoFile: true, logIntoConsole: true });

logger.info('hello world!');
logger.info('hello world2!');
logger.info('hello world3!');

const logger2 = loggerFactory.createError(process.env.LOG || 'test', { pathToLogsFolder: __dirname, logIntoFile: true, logIntoConsole: true });
logger2.error('hello world4!');
