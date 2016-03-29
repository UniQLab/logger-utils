'use strict';

const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const dateFormat = require('dateformat');
const errorsConfig = require('./../config/errors');

module.exports = {

	init(filePath) {
		if (!this.exists(filePath)) this.create(filePath);
	},

	create(filePath) {
		try {
			mkdir.sync(filePath);
		} catch (error) {
			throw new Error(`${errorsConfig.DIRECTORY_CREATION_ERROR} ${error}`);
		}
	},

	exists(filePath) {
		try {
			return fs.statSync(filePath).isDirectory();
		} catch (error) {
			return false;
		}
	},

	defineDirectoryName(pathToLogsFolder, env, logType) {
		return path.normalize(`${pathToLogsFolder}/${env}/${logType}`);
	},

	defineFileName(fileNamePrefix, fileDateFormat, fileNameExtension) {
		return `${fileNamePrefix}${dateFormat(new Date(), fileDateFormat)}${fileNameExtension}`;
	},

	defineFilePath(directoryName, fileName) {
		return path.normalize(`${directoryName}/${fileName}`);
	}
};
