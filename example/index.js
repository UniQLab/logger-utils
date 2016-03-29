
const loggerFactory = require('../');
const logger = loggerFactory.createErrorLogger('test');

logger.debug('hello world!');
logger.info('hello world2!');
logger.error('hello world3!');

