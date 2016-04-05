'use strict';

const path = require('path');

const DateService = require('./dateService');
const directoryUtils = require('./../utils/directoryUtils');

const FORMAT_SCHEMA = 'DD-MM-YYYY';

class PathService {
	constructor(foldersMeta, filesMeta) {
		this.filesMeta = filesMeta;
		this.foldersMeta = foldersMeta;
		this.dateService = new DateService();

		this.root = this._init(this.dateService.getDate(), foldersMeta, filesMeta);

		this.build = this.build.bind(this);
		this._init = this._init.bind(this);
		this._defineModel = this._defineModel.bind(this);
	}

	build() {
		const check = this.dateService.check();
		if (!check.state) return this.root.path;
		this.root = this._init(check.moment, this.foldersMeta, this.filesMeta);
		return this.root.path;
	}

	_init(moment, folderMeta, filesMeta) {
		const folder = path.join(folderMeta.root, moment.year().toString(), (moment.month() + 1).toString());
		const file = `${filesMeta.prefix}${moment.date().toString()}(${moment.format(FORMAT_SCHEMA)})${filesMeta.extension}`;
		directoryUtils.init(folder);
		return this._defineModel(folder, file);
	}

	_defineModel(folder, file) {
		return {
			folder,
			file,
			path: path.join(folder, file)
		};
	}
}

module.exports = PathService;
