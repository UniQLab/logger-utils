'use strict';

const path = require('path');
const _ = require('underscore');
const dateFormat = require('dateformat');

const errorConfig = require('./../config/errors');
const defaultConfig = require('./../config/logs');
const TransportManager = require('./../services/transportManager');

class LoggerOptionsConstructor {
	constructor(userOptions, loggerOptions) {
		this.options = Object.assign(
			this._pickRewritableOptionFields(defaultConfig),
			this._pickRewritableOptionFields(loggerOptions),
			this._pickRewritableOptionFields(userOptions)
		);

		if (!this.options.level) this._generateLogLevelDependingOnEnv.call(this);
		this._generateFilePath.call(this);

		this.transportManager = new TransportManager(
			this.options.logIntoConsole,
			this.options.logIntoFile,
			this.options.pathToLogsFolder,
			this.options.filePath
		);
	}

	bind() {
		this.generateFinalOptionsObject = this.generateFinalOptionsObject.bind(this);
	}

	set preprocessor(preprocessor) {
		if (!_.isFunction(preprocessor)) throw new Error(errorConfig.PREPROCESSOR_NOT_A_FUNCTION);
		this.options.preprocessor = preprocessor;
	}

	generateFinalOptionsObject() {
		const self = this;

		return {
			format: self.options.format,
			filters: self.options.filters,
			dateFormat: self.options.messageDateFormat,
			preprocessor: self.options.preprocessor,
			level: self.options.level,
			transport: self.transportManager.getAllStoredTransports()
		};
	}

	_pickRewritableOptionFields(allOptions) {
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

	_generateDirectoryName(context) {
		const notNormalizedDirectoryName = `${context.options.pathToLogsFolder}/${context.options.env}/${context.options.logType}`;
		context.options.directoryName = path.normalize(notNormalizedDirectoryName);
	}

	_generateFileName(context) {
		const formattedDate = dateFormat(new Date(), context.options.fileDateFormat);
		context.options.fileName = `${context.options.fileNamePrefix}${formattedDate}${context.options.fileNameExtension}`;
	}

	_generateFilePath() {
		this._generateDirectoryName(this);
		this._generateFileName(this);
		this.options.filePath = path.normalize(`${this.options.directoryName}/${this.options.fileName}`);
	}

	_generateLogLevelDependingOnEnv() {
		switch (this.options.env) {
		case 'test':
			this.options.level = 'log';
			break;
		case 'dev':
			this.options.level = 'warn';
			break;
		case 'prod':
			this.options.level = 'error';
			break;
		default:
			this.options.level = 'log';
		}
	}
}

module.exports = LoggerOptionsConstructor;
