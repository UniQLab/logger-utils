'use strict';

const _ = require('underscore');

module.exports = {

	moveOptions(object, fromKeys, toKeys) {
		if (!_.isArray(fromKeys) || !_.isArray(toKeys)) throw new Error();
		const result = {};

		_.each(fromKeys, (key, i) => {
			result[toKeys[i]] = object[key];
		});

		return result;
	}
};
