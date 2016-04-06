'use strict';

const _ = require('underscore');
const errors = require('../config/errors');

module.exports = {

	moveOptions(object, fromKeys, toKeys) {
		if (!_.isArray(fromKeys) || !_.isArray(toKeys)) throw new Error(errors.KEYS_NOT_ARRAYS);
		const result = {};

		_.each(fromKeys, (key, i) => {
			result[toKeys[i]] = object[key];
		});

		return result;
	}
};
