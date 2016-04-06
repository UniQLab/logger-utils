'use strict';

const path = require('path');

const mkdirp = require('mkdirp');
require('chai').should();

const directoryHelpers = require('./testHelpers/directoryHelpers');
const directoryUtils = require('../lib/utils/directoryUtils');
const errorsConfig = require('../lib/config/errors');
const testingConfig = require('./testHelpers/testingConfig');

const PATH_TO_LOGS_FOLDER = testingConfig.PATH_TO_LOGS_FOLDER;

describe('Testing utils/directoryUtils', function() {

    describe('Testing directoryUtils.exist', function() {

        afterEach(function(done) {
            directoryHelpers.logsDirectoryRemover(done);
        });

        it('Should return true if directory exists', function(done) {
            const pathToCreate = path.join(PATH_TO_LOGS_FOLDER, '/testingDirectory');

            mkdirp(pathToCreate, function(err) {
                if (err) throw err;

                const exists = directoryUtils.exists(pathToCreate);

                exists.should.be.true;
                done();
            })
        });

        it('Should return false if directory doesn\'t exist', function(done) {
            const pathToCreate = path.join(PATH_TO_LOGS_FOLDER, '/testingDirectory');

            mkdirp(pathToCreate, function(err) {
                if (err) throw err;

                const exists = directoryUtils.exists(path.join(pathToCreate, '/doesnt/exist'));

                exists.should.be.false;
                done();
            })
        });
    });

    describe('Testing directoryUtils.create', function() {

        afterEach(function(done) {
            directoryHelpers.logsDirectoryRemover(done);
        });

        it('Should create directory /logs/testing/directory/creation', function(done) {
            const pathToCreate = path.join(PATH_TO_LOGS_FOLDER, '/testing/directory/creation');

            directoryUtils.create(pathToCreate);

            directoryHelpers.checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            });
        });

        it('Should be okay if directory already exists', function(done) {
            const pathToCreate = PATH_TO_LOGS_FOLDER + '/testing/directory/creation';

            directoryUtils.create(pathToCreate);

            directoryHelpers.checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            }, () => {
                done();
            });
        });

        it('Should throw error if unable to create directory', function() {
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
        it('Should return a normalized path to logs directory with specified env and error type', function() {
            const resultingPath = directoryUtils.defineDirectoryName(PATH_TO_LOGS_FOLDER, 'test', 'error');

            resultingPath.should.be.equal(`${PATH_TO_LOGS_FOLDER}/test/error`);
        });
    });

    describe('Testing directoryUtils.defineFileName', function() {
        it('Should return a filename for logs file, depending on prefix, dateFormat and extension', function() {
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
        it('Should return a filePath for directory path and file name', function() {
            const resultingFilePath = directoryUtils.defineFilePath(PATH_TO_LOGS_FOLDER, 'log-30.03.2016.log');

            resultingFilePath.should.be.equal(`${PATH_TO_LOGS_FOLDER}/log-30.03.2016.log`);
        });
    });
});