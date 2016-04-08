'use strict';

const colors = require('colors');
const dateFormat = require('dateFormat');

const errorsConfig = require('../lib/config/errors');
const logsConfig = require('../lib/config/logs');
const OptionsService = require('../lib/services/optionsService');
const optionsUtils = require('../lib/utils/optionsUtils');
const testingConfig = require('./testHelpers/testingConfig');

const PATH_TO_LOGS_FOLDER = testingConfig.PATH_TO_LOGS_FOLDER;

describe('Testing options', function() {

    describe('Testing services/optionsService', function() {

        describe('Testing optionsService:constructor', function () {
            const loggerOptions = {
                fileDateFormat: 'mm.dd.yy',
                loggerDateFormat: 'HH:MM',
                format: [
                    '{{timestamp}}',
                    {
                        trace: '{{timestamp}}',
                        debug: '{{timestamp}}',
                        info: '{{message}}',
                        warn: '{{timestamp}}',
                        error: '[{{title}}]'
                    }
                ],
                filters: {
                    log: colors.black,
                    trace: colors.magenta,
                    debug: colors.blue,
                    info: colors.green,
                    warn: colors.yellow,
                    error: [colors.red, colors.bold]
                },
                fileNamePrefix: 'smth-',
                fileNameExtension: '.txt',
                logIntoConsole: false,
                logIntoFile: true,
                logType: 'log',
                pathToLogsFolder: PATH_TO_LOGS_FOLDER
            };

            const userOptions = {
                fileDateFormat: 'yy',
                loggerDateFormat: 'MM',
                fileNamePrefix: 'smth-',
                fileNameExtension: '.txt',
                logIntoConsole: true,
                logIntoFile: false,
                logType: 'log'
            };
            it('Should create optionsService with default options', function () {
                const optionsServiceInstance = new OptionsService({pathToLogsFolder: PATH_TO_LOGS_FOLDER});

                optionsServiceInstance.options.should.have.property('fileDateFormat').equals(logsConfig.fileDateFormat);
                optionsServiceInstance.options.should.have.property('loggerDateFormat').equals(logsConfig.loggerDateFormat);
                optionsServiceInstance.options.should.have.property('format').equals(logsConfig.format);
                optionsServiceInstance.options.should.have.property('filters').equals(logsConfig.filters);
                optionsServiceInstance.options.should.have.property('fileNamePrefix').equals(logsConfig.fileNamePrefix);
                optionsServiceInstance.options.should.have.property('fileNameExtension').equals(logsConfig.fileNameExtension);
                optionsServiceInstance.options.should.have.property('logIntoConsole').equals(logsConfig.logIntoConsole);
                optionsServiceInstance.options.should.have.property('logIntoFile').equals(logsConfig.logIntoFile);
                optionsServiceInstance.options.should.have.property('logType').equals(logsConfig.logType);
            });

            it('Should create optionsService with default options + loggerOptions', function () {
                const optionsServiceInstance = new OptionsService(loggerOptions);

                optionsServiceInstance.options.should.have.property('fileDateFormat').equals(loggerOptions.fileDateFormat);
                optionsServiceInstance.options.should.have.property('loggerDateFormat').equals(loggerOptions.loggerDateFormat);
                optionsServiceInstance.options.should.have.property('format').equals(loggerOptions.format);
                optionsServiceInstance.options.should.have.property('filters').equals(loggerOptions.filters);
                optionsServiceInstance.options.should.have.property('fileNamePrefix').equals(loggerOptions.fileNamePrefix);
                optionsServiceInstance.options.should.have.property('fileNameExtension').equals(loggerOptions.fileNameExtension);
                optionsServiceInstance.options.should.have.property('logIntoConsole').equals(loggerOptions.logIntoConsole);
                optionsServiceInstance.options.should.have.property('logIntoFile').equals(logsConfig.logIntoFile);
                optionsServiceInstance.options.should.have.property('logType').equals(loggerOptions.logType);
            });

            it('Should create optionsService with default options + loggerOptions + userOptions', function () {
                const optionsServiceInstance = new OptionsService(userOptions, loggerOptions);

                optionsServiceInstance.options.should.have.property('fileDateFormat').equals(userOptions.fileDateFormat);
                optionsServiceInstance.options.should.have.property('loggerDateFormat').equals(userOptions.loggerDateFormat);
                optionsServiceInstance.options.should.have.property('format').equals(loggerOptions.format);
                optionsServiceInstance.options.should.have.property('filters').equals(loggerOptions.filters);
                optionsServiceInstance.options.should.have.property('fileNamePrefix').equals(userOptions.fileNamePrefix);
                optionsServiceInstance.options.should.have.property('fileNameExtension').equals(userOptions.fileNameExtension);
                optionsServiceInstance.options.should.have.property('logIntoConsole').equals(userOptions.logIntoConsole);
                optionsServiceInstance.options.should.have.property('logIntoFile').equals(userOptions.logIntoFile);
                optionsServiceInstance.options.should.have.property('logType').equals(userOptions.logType);
            });

            it('Should throw an error if logToFile is present and pathToLogsFolder - not', function () {
                try {
                    new OptionsService({logIntoFile: true, directoryName: null});
                } catch (e) {
                    e.message.should.be.equal(errorsConfig.LOG_INTO_FILE_CONFLICT);
                }
            });
        });

        describe('Testing optionsService:set preprocessor', function () {
            it('Should throw PREPROCESSOR_NOT_A_FUNCTION error', function() {
                const optionsServiceInstance = new OptionsService({pathToLogsFolder: PATH_TO_LOGS_FOLDER});

                try {
                    optionsServiceInstance.preprocessor = {};
                } catch (e) {
                    e.should.have.property('message').equals(errorsConfig.PREPROCESSOR_NOT_A_FUNCTION);
                }
            });
        });

        describe('Testing optionsService:_defineLevel', function () {
            it('Should return a correct logging level depending on env', function() {
                const optionsServiceInstance = new OptionsService({pathToLogsFolder: PATH_TO_LOGS_FOLDER});

                optionsServiceInstance._defineLevel('test').should.be.a('string').equal('log');
                optionsServiceInstance._defineLevel('dev').should.be.a('string').equal('warn');
                optionsServiceInstance._defineLevel('prod').should.be.a('string').equal('error');
            });
        });

        describe('Testing optionsService:_defineMiddleOptions', function () {
            it('Should return a correct logging level depending on env', function() {
                const options = {
                    level: 'LOG',
                    env: 'test',
                    pathToLogsFolder: testingConfig.PATH_TO_LOGS_FOLDER,
                    logType: 'error',
                    fileNamePrefix: 'log-',
                    fileDateFormat: 'dd.mm.yyyy',
                    fileNameExtension: '.log'
                };
                const optionsServiceInstance = new OptionsService({pathToLogsFolder: PATH_TO_LOGS_FOLDER});
                const result = optionsServiceInstance._defineMiddleOptions(options);
                const folder = `${testingConfig.PATH_TO_LOGS_FOLDER}/${options.env}/${options.logType}`;
                const fileName = `${options.fileNamePrefix}${ dateFormat(new Date(), options.fileDateFormat) }${options.fileNameExtension}`;

                result.should.have.property('level');
                result.should.have.property('directoryName').equals(folder);
                result.should.have.property('fileName').equals(fileName);
                result.should.have.property('filePath').equals(`${folder}/${fileName}`);
            });
        });

        describe('Testing optionsService:_defineFinalOptions', function () {
            it('Should return a correct logging level depending on env', function() {
                const options = {
                    level: 'LOG',
                    env: 'test',
                    pathToLogsFolder: testingConfig.PATH_TO_LOGS_FOLDER,
                    logType: 'error',
                    fileNamePrefix: 'log-',
                    fileDateFormat: 'dd.mm.yyyy',
                    fileNameExtension: '.log'
                };
                const optionsServiceInstance = new OptionsService({pathToLogsFolder: PATH_TO_LOGS_FOLDER});
                const result = optionsServiceInstance._defineMiddleOptions(options);
                const folder = `${testingConfig.PATH_TO_LOGS_FOLDER}/${options.env}/${options.logType}`;
                const fileName = `${options.fileNamePrefix}${ dateFormat(new Date(), options.fileDateFormat) }${options.fileNameExtension}`;

                result.should.have.property('level');
                result.should.have.property('directoryName').equals(folder);
                result.should.have.property('fileName').equals(fileName);
                result.should.have.property('filePath').equals(`${folder}/${fileName}`);
            });
        });
    });

    describe('Testing utils/optionsUtils', function () {

        describe('Testing optionsUtils:moveOptions', function () {
            it('Should generate KEYS_NOT_ARRAY error', function() {
                try {
                    optionsUtils.moveOptions({}, {}, {});
                } catch (e) {
                    e.should.have.property('message').equals(errorsConfig.KEYS_NOT_ARRAYS);
                }
            });
            it('Should generate KEYS_NOT_ARRAY error', function() {
                const obj = {
                    hello: 'world',
                    morning: 'VIETNAM!',
                    Luk: 'I AM YOUR FATHER!'
                };
                const objKeys = Object.keys(obj);
                const objKeys2 = ['Alloha', 'Hawaii', 'friends'];

                const result = optionsUtils.moveOptions(obj, objKeys, objKeys2);

                objKeys2.forEach((key, i) => result.should.have.property(key).equals(obj[objKeys[i]]));
            });
        });
    });
});