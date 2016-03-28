'use strict';

const path = require('path');
const colors = require('colors');

module.exports = {
	fileDateFormat: 'dd.mm.yyyy',
	loggerDateFormat: 'HH:MM:ss.L',
	format: [
		'{{timestamp}}',
		{
			trace: '{{timestamp}} <{{title}}>',
			debug: '{{timestamp}} <{{title}}> {{message}} ',
			info: '[{{title}}] <{{timestamp}}>: {{message}}',
			warn: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
			error: '[{{title}}] <{{timestamp}}>: {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
		}
	],
	filters: {
		log: [colors.white, colors.underline],
		trace: colors.magenta,
		debug: colors.blue,
		info: colors.green,
		warn: colors.yellow,
		error: [colors.red, colors.bold]
	},
	pathToLogsFolder: path.join(__dirname, './logs'),
	fileNamePrefix: 'log-',
	fileNameExtension: '.log',
	logIntoConsole: true,
	logIntoFile: true,
	logType: 'error'
};
