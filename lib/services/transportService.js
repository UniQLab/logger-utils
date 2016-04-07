'use strict';

const fs = require('fs');

const PathService = require('./pathService');
const TransportStore = require('../stores/transportStore');

class TransportManager {
	constructor(isDefaultConsole, isDefaultFile, foldersMeta, filesMeta) {
		this.bind();

		this.transportStore = new TransportStore();
		if (isDefaultFile && foldersMeta && filesMeta) this.pathService = new PathService(foldersMeta, filesMeta);

		if (isDefaultConsole) this.transportStore.add(this._defineConsoleTransport());
		if (isDefaultFile) this.transportStore.add(this._defineFileTransport());
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

	_defineFileTransport() {
		return query => {
			fs.createWriteStream(this.pathService.build(), {
				flags: 'a',
				encoding: 'utf8',
				mode: 0o666
			}).write(`${query.output}\n`);
		};
	}
}

module.exports = TransportManager;
