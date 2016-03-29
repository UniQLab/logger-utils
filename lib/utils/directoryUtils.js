'use strict';

const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const dateFormat = require('dateformat');
const errorsConfig = require('./../config/errors');

module.exports = {

	init(dirPath) {
		if (!this.exists(dirPath)) this.create(dirPath);
	},

	create(dirPath) {
		try {
			mkdir.sync(dirPath);
		} catch (error) {
			throw new Error(`${errorsConfig.DIRECTORY_CREATION_ERROR} ${error}`);
		}
	},

	exists(dirPath) {
		try {
			return fs.statSync(dirPath).isDirectory();
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
