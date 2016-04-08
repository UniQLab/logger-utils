'use strict';

const LoggerFactory = require('../'); // use logger-utils in production

const LOGGER_ENV = 'test';
const requestLogger = LoggerFactory.createRequests(process.env.LOGGER_ENV || LOGGER_ENV, __dirname);

function fibonacci(n) {
	let sequence;
	let a = 1;
	let b = 1;
	sequence = `${a} ${b} `;
	for (let i = 3; i <= n; i++) {
		const c = a + b;
		a = b;
		b = c;
		sequence += `${c} `;
	}
	return { b, sequence };
}

const query = fibonacci(5);
requestLogger.debug(`Sequence: ${query.sequence}`);
requestLogger.info(`Fibonacci summary: ${query.b}`);
