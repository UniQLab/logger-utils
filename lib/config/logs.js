'use strict';

const colors = require('colors');

module.exports = {
	fileDateFormat: 'dd.mm.yyyy',
	loggerDateFormat: 'HH:MM on dd/mm/yyyy',
	format: [
		'{{timestamp}} - {{message}} (in {{file}}:{{line}})',
		{
			trace: '{{timestamp}} - {{message}} (in {{file}}:{{line}})',
			debug: '{{timestamp}} - method:{{method}} | {{message}} (in {{file}}:{{line}}:{{pos}})',
			info: '{{message}} (in {{file}}:{{line}})',
			warn: '{{timestamp}} - {{message}} (in {{file}}:{{line}})',
			error: '[{{title}}] <{{timestamp}}>: {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
		}
	],
	filters: {
		log: colors.white,
		trace: colors.magenta,
		debug: colors.blue,
		info: colors.green,
		warn: colors.yellow,
		error: [colors.red, colors.bold]
	},
	fileNamePrefix: 'log-',
	fileNameExtension: '.log',
	logIntoConsole: true,
	logIntoFile: true,
	logType: 'error'
};
