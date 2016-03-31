'use strict';

const tracer = require('tracer');

const OptionsService = require('./../services/optionsService');
const errorConfig = require('../config/errors');
const typesConfig = require('../config/types');

class Logger {
	constructor(resultingOptions) {
		return tracer.colorConsole(resultingOptions);
	}

	static createCustomLogger(options, specific) {
		const optionsConstructor = new OptionsService(options, specific);
		return new Logger(optionsConstructor.defineFinalOptions());
	}

	static createDefaultLogger(env, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.DEFAULT_LOGGER,
			logIntoConsole: true,
			logIntoFile: false
		};

		return this.createCustomLogger(options, specific);
	}

	static createErrorLogger(env, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.ERROR_LOGGER,
			logIntoConsole: true,
			logIntoFile: false
		};

		return this.createCustomLogger(options, specific);
	}

	static createRequestsLogger(env, dirName, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.REQUESTS_LOGGER,
			pathToLogsFolder: dirName,
			logIntoConsole: true,
			logIntoFile: true
		};

		return this.createCustomLogger(options, specific);
	}
}

module.exports = Logger;
