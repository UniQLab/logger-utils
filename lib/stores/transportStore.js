'use strict';

const _ = require('underscore');
const errorsConfig = require('./../config/errors');

class TransportStore {
	constructor() {
		this.transports = [];
		this.add = this.add.bind(this);
		this.get = this.get.bind(this);
		this.exists = this.exists.bind(this);
	}

	add(transport) {
		if (!_.isFunction(transport) && !_.isArray(transport)) throw new Error(errorsConfig.UNSUPPORTED_ARGUMENT_TYPE_IN_TRANSPORT);

		if (_.isFunction(transport)) this.transports.push(transport);
		else _.each(transport, single => this.transports.push(single));

		return this;
	}

	get() {
		return this.transports;
	}

	exists(transport) {
		return _.contains(this.transports, transport);
	}
}

module.exports = TransportStore;
