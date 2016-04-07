'use strict';

const LoggerFactory = require('../');

const logger = LoggerFactory.createError('test', __dirname);
logger.info('hello world!');

logger.info('hello world2!');
logger.info('hello world3!');

const logger2 = LoggerFactory.createRequests(process.env.LOG || 'test', __dirname, { logIntoFile: true, logIntoConsole: true });
logger2.error('hello world4!');
