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
	 * Create an instance of logger with custom options.
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
	 * Create an instance of logger that writes data in console.
	 * @function
	 * @param {string} env - Default log level.
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
	 * Create an instance of logger that writes data in files.
	 * @function
	 * @param {string} env - Default log level.
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

	/**
	 * Create an instance of logger that writes data in files and console simultaneously.
	 * @function
	 * @param {string} env - Default log level.
	 * @param {string} dirName - Directory where logs will store.
	 * @param {object} options - User options.
	 * @return {logger} Return an instance of logger.
	 */
	static createError(env, dirName, options) {
		if (!env) throw new Error(errorConfig.ENV_IS_NOT_SET);

		const specific = {
			env,
			logType: typesConfig.ERROR_LOGGER,
			pathToLogsFolder: dirName,
			logIntoConsole: true,
			logIntoFile: true
		};

		return this.createCustom(options, specific);
	}
}

module.exports = Logger;
