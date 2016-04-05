'use strict';

const fs = require('fs');

const TransportStore = require('../stores/transportStore');
const directoryUtils = require('./../utils/directoryUtils');
const DateService = require('./dateService');

class TransportManager {
	constructor(isDefaultConsole, isDefaultFile, folderPath, filePath) {
		this.bind();
		this.transportStore = new TransportStore();
		this.dateService = new DateService();

		if (isDefaultConsole) this.transportStore.add(this._defineConsoleTransport());
		if (isDefaultFile) this.transportStore.add(this._defineFileTransport(folderPath, filePath));
	}

	bind() {
		this.all = this.all.bind(this);
		this._defineFileTransport = this._defineFileTransport.bind(this);
		this._defineConsoleTransport = this._defineConsoleTransport.bind(this);
	}

	all() {
		return this.transportStore.get();
	}

	_defineConsoleTransport() {
		return query => console.log(query.output);
	}

	_defineFileTransport(folderPath, filePath) {
		directoryUtils.init(folderPath);

		return query => {
			fs.createWriteStream(filePath, {
				flags: 'a',
				encoding: 'utf8',
				mode: 0o666
			}).write(`${query.output}\n`);
		};
	}
}

module.exports = TransportManager;
