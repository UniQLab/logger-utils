'use strict';

const fs = require('fs');
const path = require('path');
const colors = require('colors');
require('chai').should();
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const dateformat = require('dateformat');

const errorsConfig = require('../lib/config/errors');
const logsConfig = require('../lib/config/logs');
const TransportStore = require('../lib/stores/transportStore');
const TransportService = require('../lib/services/transportService');
const OptionsService = require('../lib/services/optionsService');

const pathToLogsFolder = path.join(__dirname, '../logs');

function checkIfExists(directory) {
    return new Promise((resolve, reject) => {
        fs.stat(directory, function(err, stats) {
            if (err) {
                return resolve(false);
            }
            if (stats.isDirectory()) {
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            } else {
                throw new Error('Path already exists, but it is not a directory');
            }
        });
    });
}

function logsDirectoryRemover(done) {
    return checkIfExists(pathToLogsFolder).then((exists) => {
        if (exists) {
            rimraf(pathToLogsFolder, function(err) {
                if (err) {
                    console.log(err);
                    return done();
                }
                return done();
            });
        } else {
            return done();
        }
    }, err => {
        console.log(err);
        if (err) {
            console.log(err);
            return done();
        }
    });
}

describe('Testing utils/directoryUtils', function() {

    const directoryUtils = require('../lib/utils/directoryUtils');

    describe('Testing directoryUtils.exist', function() {

        afterEach(function(done) {
            logsDirectoryRemover(done);
        });

        it('should return true if directory exists', function(done) {
            const pathToCreate = path.join(pathToLogsFolder, '/testingDirectory');

            mkdirp(pathToCreate, function(err) {
                if (err) {
                    throw err;
                }

                const exists = directoryUtils.exists(pathToCreate);

                exists.should.be.true;
                done();
            })
        });

        it('should return false if directory doesn\'t exist', function(done) {
            const pathToCreate = path.join(pathToLogsFolder, '/testingDirectory');

            mkdirp(pathToCreate, function(err) {
                if (err) {
                    throw err;
                }

                const exists = directoryUtils.exists(path.join(pathToCreate, '/doesnt/exist'));

                exists.should.be.false;
                done();
            })
        });

    });

    describe('Testing directoryUtils.create', function() {

        afterEach(function(done) {
            logsDirectoryRemover(done);
        });

        it('should create directory /logs/testing/directory/creation', function(done) {
            const pathToCreate = path.join(pathToLogsFolder, '/testing/directory/creation');

            directoryUtils.create(pathToCreate);

            checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            });
        });

        it('should be okey if directory already exists', function(done) {
            const pathToCreate = pathToLogsFolder + '/testing/directory/creation';

            directoryUtils.create(pathToCreate);

            checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            }, err => {
                console.log(err);
                done();
            });
        });

        it('should throw error if unable to create directory', function() {
            const pathToCreate = null;

            try {
                directoryUtils.create(pathToCreate);
            } catch (e) {
                const hasError = e.message.indexOf(errorsConfig.DIRECTORY_CREATION_ERROR);
                hasError.should.not.be.equal(-1);
            }
        });

    });

    describe('Testing directoryUtils.defineDirectoryName', function() {

        it('should return a normalized path to logs directory with specified env and error type', function() {
            const resultingPath = directoryUtils.defineDirectoryName(pathToLogsFolder, 'test', 'error');

            resultingPath.should.be.equal(`${pathToLogsFolder}/test/error`);
        });

    });

    describe('Testing directoryUtils.defineFileName', function() {

        it('should return a filename for logs file, depending on prefix, dateFormat and extension', function() {
            const resultingFileName = directoryUtils.defineFileName('log-', 'dd.mm.yy', '.log');

            const newDate = new Date();

            let year = newDate.getFullYear().toString();
            let month = newDate.getMonth() + 1 + '';
            let date = newDate.getDate().toString();

            year = year.slice(2);

            if (month.length < 2) month = 0 + month;
            if (date.length < 2) date = 0 + date;

            resultingFileName.should.be.equal(`log-${date}.${month}.${year}.log`);
        });

    });

    describe('Testing directoryUtils.defineFilePath', function() {

        it('should return a filePath for directory path and file name', function() {
            const resultingFilePath = directoryUtils.defineFilePath(pathToLogsFolder, 'log-30.03.2016.log');

            resultingFilePath.should.be.equal(`${pathToLogsFolder}/log-30.03.2016.log`);
        });

    });
});

describe('Testing transports', function() {

    describe('Testing stores/transportStore', function() {
        let transportStoreInstance;
        const mockTransport = () => {};

        beforeEach(function () {
            transportStoreInstance = new TransportStore();
        });

        describe('testing transportStore:addTransport', function() {
           it('Should add a transport to transports array', function() {
               transportStoreInstance.add(mockTransport);
               transportStoreInstance.should.have.property('transports').which.has.property('length').equal(1);
           });
           it('Should NOT add a transport if it already exists', function() {
               transportStoreInstance.add(mockTransport);
               transportStoreInstance.should.have.property('transports').which.has.property('length').not.equal(2);
           });
           it('Should through an error if adding not a function', function() {
               try {
                   transportStoreInstance.add('str');
               } catch (e) {
                   e.should.have.property('message').equal(errorsConfig.UNSUPPORTED_ARGUMENT_TYPE_IN_TRANSPORT);
               }
           });
        });

        describe('testing transportStore:exists', function() {
           it('Should return false', function() {
               const exists = transportStoreInstance.exists(mockTransport);
               exists.should.be.false;
           });
           it('Should return true', function() {
               transportStoreInstance.add(mockTransport);
               const exists = transportStoreInstance.exists(mockTransport);
               exists.should.be.ok;
           });
       });

        describe('testing transportStore:get', function() {
           it('Should return transports array', function() {
               const transportsArray = transportStoreInstance.get();
               transportsArray.should.be.an('array');
           });
           it('Should return true', function() {
               transportStoreInstance.add(mockTransport);
               const transportsArray = transportStoreInstance.get();
               transportsArray.should.be.an('array').and.have.property('length').equal(1);
           });
       });
    });

    describe('Testing services/transportService', function() {
        const filePath = path.join(pathToLogsFolder, '/logsFile.log');

        describe('testing transportService:constructor', function() {
           it('Should not add any transports if logToFile and logToConsole are false', function() {
               const service = new TransportService(false, false);

               service.transportStore.get().should.have.property('length').equal(0);
           });
           it('Should add only console transport if logToFile is false and logToConsole is true', function() {
               const service = new TransportService(true, false);

               service.transportStore.get().should.have.property('length').equal(1);
               service.transportStore.get()[0].toString()
                   .should
                   .be
                   .equal('query => console.log(query.output)');
           });
           it('Should add only file transport if logToFile is true and logToConsole is false', function() {

               const fileTransportString = 'query => {\n\t\t\tfs.createWriteStream(filePath, {\n\t\t\t\tflags: \'a\',\n\t\t\t\tencoding: \'utf8\',\n\t\t\t\tmode: 0o666\n\t\t\t}).write(`${query.output}\\n`);\n\t\t}';
               const service = new TransportService(false, true, pathToLogsFolder, filePath);

               service.transportStore.get().should.have.property('length').equal(1);
               service.transportStore.get()[0].toString()
                   .should
                   .be
                   .equal(fileTransportString);
           });
           it('Should add file transport and log transport', function() {

               const fileTransportString = 'query => {\n\t\t\tfs.createWriteStream(filePath, {\n\t\t\t\tflags: \'a\',\n\t\t\t\tencoding: \'utf8\',\n\t\t\t\tmode: 0o666\n\t\t\t}).write(`${query.output}\\n`);\n\t\t}';
               const service = new TransportService(true, true, pathToLogsFolder, filePath);

               service.transportStore.get().should.have.property('length').equal(2);
               service.transportStore.get()[0].toString()
                   .should
                   .be
                   .equal('query => console.log(query.output)');
               service.transportStore.get()[1].toString()
                   .should
                   .be
                   .equal(fileTransportString);
           });
        });

        describe('testing transportService:all', function() {
            it('Should return 0 transports, when adding no file transports', function() {
                const service = new TransportService(false, false);

                service.transportStore.get().should.have.property('length').equal(0);
            });
            it('Should return 1 transports, when adding only console transport', function() {
                const service = new TransportService(true, false);

                service.transportStore.get().should.have.property('length').equal(1);
            });
            it('Should return 1 transports when adding only file transport', function() {
                const service = new TransportService(false, true, pathToLogsFolder, filePath);

                service.transportStore.get().should.have.property('length').equal(1);
            });
            it('Should return 2 transports when adding both file transports', function() {
                const service = new TransportService(true, true, pathToLogsFolder, filePath);

                service.transportStore.get().should.have.property('length').equal(2);
            });
        });

        describe('testing transportService:_defineConsoleTransport', function() {
            it('Should create a console transport', function() {
                const service = new TransportService(false, false);

                service._defineConsoleTransport().toString()
                    .should
                    .be
                    .equal('query => console.log(query.output)');
            });
        });

        describe('testing transportService:_defineFileTransport', function() {
            it('Should create a file transport', function() {
                const filePath = path.join(pathToLogsFolder, '/logsFile.log');
                const service = new TransportService(false, false);
                const fileTransportString = 'query => {\n\t\t\tfs.createWriteStream(filePath, {\n\t\t\t\tflags: \'a\',\n\t\t\t\tencoding: \'utf8\',\n\t\t\t\tmode: 0o666\n\t\t\t}).write(`${query.output}\\n`);\n\t\t}';

                service._defineFileTransport(pathToLogsFolder, filePath).toString()
                    .should
                    .be
                    .equal(fileTransportString);
            });
        });
    });
});

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
                pathToLogsFolder: pathToLogsFolder
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
                const optionsServiceInstance = new OptionsService({pathToLogsFolder});

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
                const optionsServiceInstance = new OptionsService({pathToLogsFolder});

            });
        });
    });
});