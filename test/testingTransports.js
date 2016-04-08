'use strict';
const path = require('path');

const testingConfig = require('./testHelpers/testingConfig');
const errorsConfig = require('../lib/config/errors');
const TransportStore = require('../lib/stores/transportStore');
const TransportService = require('../lib/services/transportService');

describe('Testing transports', function() {
    const FILE_TRANSPORT_STRING = testingConfig.FILE_TRANSPORT_STRING;
    const CONSOLE_TRANSPORT_STRING = testingConfig.CONSOLE_TRANSPORT_STRING;
    const PATH_TO_LOGS_FOLDER = testingConfig.PATH_TO_LOGS_FOLDER;

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

        const folderMeta = {root: testingConfig.PATH_TO_LOGS_FOLDER};
        const fileMeta = {
            prefix: 'log-',
            extension: '.log'
        };

        describe('Testing transportService:constructor', function() {
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
                    .equal(CONSOLE_TRANSPORT_STRING);
            });
            it('Should add only file transport if logToFile is true and logToConsole is false', function() {

                const service = new TransportService(false, true, folderMeta, fileMeta);

                service.transportStore.get().should.have.property('length').equal(1);
                service.transportStore.get()[0].toString()
                    .should
                    .be
                    .equal(FILE_TRANSPORT_STRING);
            });
            it('Should add file transport and log transport', function() {

                const service = new TransportService(true, true, folderMeta, fileMeta);

                service.transportStore.get().should.have.property('length').equal(2);
                service.transportStore.get()[0].toString()
                    .should
                    .be
                    .equal('query => console.log(query.output)');
                service.transportStore.get()[1].toString()
                    .should
                    .be
                    .equal(FILE_TRANSPORT_STRING);
            });
        });

        describe('Testing transportService:all', function() {
            it('Should return 0 transports, when adding no file transports', function() {
                const service = new TransportService(false, false);

                service.transportStore.get().should.have.property('length').equal(0);
            });
            it('Should return 1 transports, when adding only console transport', function() {
                const service = new TransportService(true, false);

                service.transportStore.get().should.have.property('length').equal(1);
            });
            it('Should return 1 transports when adding only file transport', function() {
                const service = new TransportService(false, true, folderMeta, fileMeta);

                service.transportStore.get().should.have.property('length').equal(1);
            });
            it('Should return 2 transports when adding both file transports', function() {
                const service = new TransportService(true, true, folderMeta, fileMeta);

                service.transportStore.get().should.have.property('length').equal(2);
            });
        });

        describe('Testing transportService:_defineConsoleTransport', function() {
            it('Should create a console transport', function() {
                const service = new TransportService(false, false);

                service._defineConsoleTransport().toString()
                    .should
                    .be
                    .equal(CONSOLE_TRANSPORT_STRING);
            });
        });

        describe('Testing transportService:_defineFileTransport', function() {
            it('Should create a file transport', function() {
                const filePath = path.join(PATH_TO_LOGS_FOLDER, '/logsFile.log');
                const service = new TransportService(false, false);

                service._defineFileTransport(PATH_TO_LOGS_FOLDER, filePath).toString()
                    .should
                    .be
                    .equal(FILE_TRANSPORT_STRING);
            });
        });
    });
});