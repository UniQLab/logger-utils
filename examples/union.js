'use strict';

const LoggerFactory = require('../'); // use logger-utils in production

const LOGGER_ENV = 'test';
const LOGGER_UNION = {
	default: LoggerFactory.createDefault(process.env.LOGGER_ENV || LOGGER_ENV),
	request: LoggerFactory.createRequests(process.env.LOGGER_ENV || LOGGER_ENV, __dirname),
	error: LoggerFactory.createError(process.env.LOGGER_ENV || LOGGER_ENV, __dirname)
};

LOGGER_UNION.default.info('Hello world!');
LOGGER_UNION.request.warn('Hello union!');
LOGGER_UNION.error.error('Hello logger!');
