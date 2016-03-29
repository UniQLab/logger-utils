'use strict';

const path = require('path');
const _ = require('underscore');
const dateFormat = require('dateformat');

const errorConfig = require('./../config/errors');
const defaultConfig = require('./../config/logs');
const levelsConfig = require('../config/levels');
const TransportService = require('./transportService');

class OptionsService {
	constructor(userOptions, loggerOptions) {
		this.options = Object.assign(
			this._pickOptions(defaultConfig),
			this._pickOptions(loggerOptions),
			this._pickOptions(userOptions)
		);

		if (!this.options.level) this.options.level = this._defineLevel(this.options.env);
		this.options.directoryName = this._defineDirectoryName(this.options);
		this.options.fileName = this._defineFileName(this.options);
		this.options.filePath = this._defineFilePath(this.options);

		this.transportService = new TransportService(
			this.options.logIntoConsole,
			this.options.logIntoFile,
			this.options.pathToLogsFolder,
			this.options.filePath
		);

		this.bind();
	}

	bind() {
		this._pickOptions = this._pickOptions.bind(this);
		this._defineLevel = this._defineLevel.bind(this);
		this._defineFileName = this._defineFileName.bind(this);
		this._defineFilePath = this._defineFilePath.bind(this);
		this._defineDirectoryName = this._defineDirectoryName.bind(this);
		this.generateFinalOptionsObject = this.generateFinalOptionsObject.bind(this);
	}

	set preprocessor(preprocessor) {
		if (!_.isFunction(preprocessor)) throw new Error(errorConfig.PREPROCESSOR_NOT_A_FUNCTION);
		this.options.preprocessor = preprocessor;
	}

	generateFinalOptionsObject() {
		return {
			format: this.options.format,
			filters: this.options.filters,
			dateFormat: this.options.messageDateFormat,
			preprocessor: this.options.preprocessor,
			level: this.options.level,
			transport: this.transportService.getAllStoredTransports()
		};
	}

	_defineLevel(env) {
		switch (env) {
		case levelsConfig.ENV.TEST: return levelsConfig.OPTION.LOG;
		case levelsConfig.ENV.DEVELOPMENT: return levelsConfig.OPTION.WARNING;
		case levelsConfig.ENV.PRODUCTION: return levelsConfig.OPTION.ERROR;
		default: return levelsConfig.OPTION.LOG;
		}
	}

	_defineDirectoryName(options) {
		const notNormalizedDirectoryName = `${options.pathToLogsFolder}/${options.env}/${options.logType}`;
		return path.normalize(notNormalizedDirectoryName);
	}

	_defineFileName(options) {
		const formattedDate = dateFormat(new Date(), options.fileDateFormat);
		return `${options.fileNamePrefix}${formattedDate}${options.fileNameExtension}`;
	}

	_defineFilePath(options) {
		return path.normalize(`${options.directoryName}/${options.fileName}`);
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
