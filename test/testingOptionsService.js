'use strict';

const colors = require('colors');

const errorsConfig = require('../lib/config/errors');
const logsConfig = require('../lib/config/logs');
const OptionsService = require('../lib/services/optionsService');
const testingConfig = require('./testHelpers/testingConfig');

const PATH_TO_LOGS_FOLDER = testingConfig.PATH_TO_LOGS_FOLDER;

describe('Testing options', function() {

    describe('Testing services/optionsService', function() {

        describe('testing optionsService:constructor', function () {
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
                logIntoConsole: false,
                logIntoFile: true,
                logType: 'log'
            };
            it('Should create optionsService with default options', function () {
                const optionsServiceInstance = new OptionsService({PATH_TO_LOGS_FOLDER});

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
                optionsServiceInstance.options.should.have.property('logIntoFile').equals(logsConfig.logIntoFile);
                optionsServiceInstance.options.should.have.property('logType').equals(userOptions.logType);
            });

            it('Should throw an error if logToFile is present and pathToLogsFolder - not', function () {
                try {
                    const optionsServiceInstance = new OptionsService({logIntoFile: true, directoryName: null});
                } catch (e) {
                    e.message.should.be.equal(errorsConfig.LOG_INTO_FILE_CONFLICT);
                }
            });
        });


        describe('testing optionsService:set preprocessor', function () {
            it('should throw REPROCESSOR_NOT_A_FUNCTION error', function() {
                const optionsServiceInstance = new OptionsService({PATH_TO_LOGS_FOLDER});

            });
        });
    });
});