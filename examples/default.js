'use strict';

const LoggerFactory = require('../'); // use logger-utils in production

const LOGGER_ENV = 'test';
const defaultLogger = LoggerFactory.createDefault(process.env.LOGGER_ENV || LOGGER_ENV);

defaultLogger.info('Hello World!');
