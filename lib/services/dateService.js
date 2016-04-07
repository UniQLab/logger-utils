'use strict';

const moment = require('moment');

const UNIX_CONVERTER = 1000;

class _dateService {
	constructor() {
		this._date = moment.unix(new Date().getTime() / UNIX_CONVERTER);

		this.check = this.check.bind(this);
		this.getDate = this.getDate.bind(this);
		this._defineModel = this._defineModel.bind(this);
	}

	getDate() {
		return this._date;
	}

	check() {
		const currentDate = moment.unix(new Date().getTime() / UNIX_CONVERTER);
		if (!this._date.isBefore(currentDate)) return this._defineModel(false);
		if (this._date.year()  !== currentDate.year()  ||
			this._date.month() !== currentDate.month() ||
			this._date.date()  !== currentDate.date()) {
				this._date = currentDate;
				return this._defineModel(true, this._date);
		}
		return this._defineModel(false);
	}

	_defineModel(state, moment) {
		return { state, moment };
	}
}

module.exports = _dateService;
