'use strict';

const fs = require('fs');
const _ = require('underscore');

const errorsConfig = require('./../config/errors');
const directoryCreatorUtils = require('./../utils/directoryCreatorUtils');

class TransportManager {
	constructor(isDefaultConsole, isDefaultFile, folderPath, filePath) {
		this.bind();
		this.transports = [];
		if (isDefaultConsole) this.addTransportToStorage(this._generateDefaultConsoleTransport());
		if (isDefaultFile) this.addTransportToStorage(this._generateDefaultFileTransport(folderPath, filePath));
	}

	bind() {
		this._transportExists = this._transportExists.bind(this);
		this.addTransportToStorage = this.addTransportToStorage.bind(this);
		this.getAllStoredTransports = this.getAllStoredTransports.bind(this);
		this._generateDefaultConsoleTransport = this._generateDefaultConsoleTransport.bind(this);
		this._generateDefaultFileTransport = this._generateDefaultFileTransport.bind(this);
	}

	addTransportToStorage(transport) {
		if (!_.isFunction(transport) && !_.isArray(transport)) throw new Error(errorsConfig.UNSUPPORTED_ARGUMENT_TYPE_IN_TRANSPORT);

		if (_.isFunction(transport)) this.transports.push(transport);
		else _.each(transport, single => this.transports.push(single));

		return this;
	}

	getAllStoredTransports() {
		return this.transports;
	}

	_generateDefaultConsoleTransport() {
		return data => console.log(data.output);
	}

	_generateDefaultFileTransport(pathToLogsFolder, filePath) {
		directoryCreatorUtils.createIfExists(pathToLogsFolder);
		return data => {
			fs.createWriteStream(filePath, {
				flags: 'a',
				encoding: 'utf8',
				mode: 0o666
			}).write(`${data.output}\n`);
		};
	}

	_transportExists(transport) {
		return _.contains(this.transports, transport);
	}
}

module.exports = TransportManager;
