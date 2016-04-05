'use strict';

const _ = require('underscore');

const DateService = require('./dateService');
const TransportService = require('./transportService');
const directoryUtils = require('../utils/directoryUtils');
const errorConfig = require('./../config/errors');
const defaultConfig = require('./../config/logs');
const levelsConfig = require('../config/levels');

class OptionsService {
	constructor(userOptions, loggerOptions) {
		this.options = _.extend(
			this._pickOptions(defaultConfig),
			this._pickOptions(loggerOptions),
			this._pickOptions(userOptions)
		);

		if (this.logIntoFile && !this.options.pathToLogsFolder) throw new Error(errorConfig.LOG_INTO_FILE_CONFLICT);

		this.options = _.extend(
			this.options,
			this._defineMiddleOptions(this.options)
		);

		this.transportService = new TransportService(
			this.options.logIntoConsole,
			this.options.logIntoFile,
			this.options.directoryName,
			this.options.filePath
		);

		this.dateService = new DateService();
		this.bind();
	}

	bind() {
		this.defineFinalOptions = this.defineFinalOptions.bind(this);
		this._pickOptions = this._pickOptions.bind(this);
		this._defineLevel = this._defineLevel.bind(this);
		this._defineMiddleOptions = this._defineMiddleOptions.bind(this);
	}

	set preprocessor(preprocessor) {
		if (!_.isFunction(preprocessor)) throw new Error(errorConfig.PREPROCESSOR_NOT_A_FUNCTION);
		this.options.preprocessor = preprocessor;
	}

	defineFinalOptions() {
		return {
			format: this.options.format,
			filters: this.options.filters,
			dateFormat: this.options.messageDateFormat,
			preprocessor: this.options.preprocessor,
			level: this.options.level,
			transport: this.transportService.all()
		};
	}

	_defineMiddleOptions(options) {
		const level = options.level || this._defineLevel(options.env);
		const directoryName = directoryUtils.defineDirectoryName(options.pathToLogsFolder, options.env, options.logType);
		const fileName = directoryUtils.defineFileName(options.fileNamePrefix, options.fileDateFormat, options.fileNameExtension);
		const filePath = directoryUtils.defineFilePath(directoryName, fileName);
		return { level, directoryName, fileName, filePath };
	}

	_defineLevel(env) {
		switch (env) {
		case levelsConfig.ENV.TEST: return levelsConfig.OPTION.LOG;
		case levelsConfig.ENV.DEVELOPMENT: return levelsConfig.OPTION.WARNING;
		case levelsConfig.ENV.PRODUCTION: return levelsConfig.OPTION.ERROR;
		default: return levelsConfig.OPTION.LOG;
		}
	}

	_pickOptions(allOptions) {
		return _.pick(allOptions,
			'fileDateFormat',
			'loggerDateFormat',
			'format',
			'filters',
			'pathToLogsFolder',
			'fileNamePrefix',
			'fileNameExtension',
			'logIntoConsole',
			'logIntoFile',
			'logType',
			'env',
			'preprocessor'
		);
	}
}

module.exports = OptionsService;
