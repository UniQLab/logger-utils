'use strict';

const LoggerFactory = require('../'); // use logger-utils in production

const LOGGER_ENV = 'test';
const errorLogger = LoggerFactory.createError(process.env.LOGGER_ENV || LOGGER_ENV, __dirname);

let obj;

try {
	const a = obj.b;
} catch (e) {
	errorLogger.error(e);
}
