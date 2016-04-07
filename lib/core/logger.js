'use strict';

const tracer = require('tracer');

const OptionsService = require('./../services/optionsService');
const errorConfig = require('../config/errors');
const typesConfig = require('../config/types');

class Logger {
	constructor() {
		throw new Error(errorConfig.INSTANCE_LOGGER_REFUSED);
	}

	/**
	 * Create a custom logger.
	 * @function
	 * @param {object} options - User options.
	 * @param {object} specific - Specific options.
	 * @return {logger} Return an instance of logger.
	 */
	static createCustom(options, specific) {
		const optionsConstructor = new OptionsService(options, specific);
		return tracer.colorConsole(optionsConstructor.defineFinalOptions());
	}

	/**
	 * Create a logger with default parameters.
	 * @function
	 * @param {string} env - Default logger type (log level).
	 * @param {object} options - User options.
	 * @return {logger} Return an instance of logger.
	 */
	static createDefault(env, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.DEFAULT_LOGGER,
			logIntoConsole: true,
			logIntoFile: false
		};

		return this.createCustom(options, specific);
	}

	/**
	 * Create an error logger.
	 * @function
	 * @param {string} env - Default logger type (log level).
	 * @param {object} options - User options.
	 * @return {logger} Return an instance of logger.
	 */
	static createError(env, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.ERROR_LOGGER,
			logIntoConsole: true,
			logIntoFile: false
		};

		return this.createCustom(options, specific);
	}

	/**
	 * Create a request logger.
	 * @function
	 * @param {string} env - User options.
	 * @param {string} dirName - Directory where logs will store.
	 * @param {object} options - User options.
	 * @return {logger} Return an instance of logger.
	 */
	static createRequests(env, dirName, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.REQUESTS_LOGGER,
			pathToLogsFolder: dirName,
			logIntoConsole: false,
			logIntoFile: true
		};

		return this.createCustom(options, specific);
	}
}

module.exports = Logger;
