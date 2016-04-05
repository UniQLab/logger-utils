'use strict';

const moment = require('moment');
const EventEmitter = require('events');

const listenersConfig = require('../config/listeners');

class DateService {
	constructor() {
		this.emitter = new EventEmitter();
		this.date = moment.unix(new Date().getTime() / 1000);

		this.check = this.check.bind(this);
		this._dayChanged = this._dayChanged.bind(this);
		this._monthChanged = this._monthChanged.bind(this);
	}

	check() {

	}

	_dayChanged() {
		this.emitter.emit(listenersConfig.ON_DAY_CHANGED);
	}

	_monthChanged() {
		this.emitter.emit(listenersConfig.ON_MONTH_CHANGED);
	}
}

module.exports = DateService;
