'use strict';

const tracer = require('tracer');
const LoggerOptionsConstructor = require('./../utils/loggerOptions');

class Logger {
	constructor(resultingOptions) {
		return tracer.colorConsole(resultingOptions);
	}

	static createCustomLogger(options, specific) {
		const optionsConstructor = new LoggerOptionsConstructor(options, specific);
		return new this(optionsConstructor.generateFinalOptionsObject());
	}

	static createRequestsLogger(env, options) {
		const specific = {
			env,
			logType: 'requests',
			logIntoConsole: true,
			logIntoFile: true
		};

		return this.createCustomLogger(options, specific);
	}

	static createErrorLogger(env, options) {
		const specific = {
			env,
			logType: 'error',
			logIntoConsole: true,
			logIntoFile: false
		};

		return this.createCustomLogger(options, specific);
	}

	static createStandardLogger(env, options) {
		const specific = {
			env,
			logType: 'log',
			logIntoConsole: false,
			logIntoFile: false
		};

		return this.createCustomLogger(options, specific);
	}
}

module.exports = Logger;
