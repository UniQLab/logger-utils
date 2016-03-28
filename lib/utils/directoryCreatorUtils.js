'use strict';

const fs = require('fs');
const mkdir = require('mkdirp');
const errorsConfig = require('./../config/errors');

module.exports = {

	create(path) {
		if (!this.isExists(path)) {
			try {
				mkdir.sync(path);
			} catch (error) {
				throw new Error(`${errorsConfig.DIRECTORY_CREATION_ERROR} ${error}`);
			}
		}
	},

	isExists(path) {
		try {
			const stats = fs.statSync(path);
			return stats.isDirectory();
		} catch (error) {
			return false;
		}
	}
};
