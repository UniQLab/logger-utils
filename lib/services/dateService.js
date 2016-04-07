'use strict';

const moment = require('moment');

class _dateService {
	constructor() {
		this._date = moment(new Date().getTime());

		this.check = this.check.bind(this);
		this.getDate = this.getDate.bind(this);
		this._defineModel = this._defineModel.bind(this);
	}

	getDate() {
		return this._date;
	}

	check() {
		const currentDate = moment(new Date().getTime());
		if (!this._date.isBefore(currentDate)) return this._defineModel(false);
		if (this._date.year()  !== currentDate.year()  ||
			this._date.month() !== currentDate.month() ||
			this._date.date()  !== currentDate.date()) {
				this._date = currentDate;
				return this._defineModel(true, this._date);
		}

		return this._defineModel(false);
	}

	_defineModel(state, date) {
		return { state, date };
	}
}

module.exports = _dateService;
