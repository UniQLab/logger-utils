'use strict';

const LoggerFactory = require('../'); // use logger-utils in production

const options = {
	fileNamePrefix: 'custom-',
	fileNameExtension: '.myfile',
	logIntoConsole: true,
	logIntoFile: true,
	pathToLogsFolder: __dirname
};

const specific = {
	env: 'test',
	logType: 'log'
};

const customLogger = LoggerFactory.createCustom(options, specific);

customLogger.error('Hello world');
