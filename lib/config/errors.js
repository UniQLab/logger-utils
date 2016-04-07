module.exports = {
	INSTANCE_LOGGER_REFUSED: 'Creation instances of logger class is not allowed there',
	ENV_IS_NOT_SET: 'Environment variable is not present in logger options',
	PREPROCESSOR_NOT_A_FUNCTION: 'Preprocessor must be a function',
	REWRITE_FORMATTER_ERROR: 'Either logMethod or formatter are invalid data types, or there is no such formatter method',
	UNSUPPORTED_ARGUMENT_TYPE_IN_TRANSPORT: 'Trying to add unsupported argument type, while adding transport in logger',
	CREATING_LOGS_DIR: 'Could not create logs directory',
	NON_EXISTENT_DIRECTORY: 'The directory doesn\'t exist or not enough rights',
	DIRECTORY_CREATION_ERROR: 'Unable to create a directory. Reason: ',
	LOG_INTO_FILE_CONFLICT: 'LogIntoFile is enabled, but don`t set default directory',
	KEYS_NOT_ARRAYS: 'Either of "FromKeys" or "toKeys" are not arrays'
};
