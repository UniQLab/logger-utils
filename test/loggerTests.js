'use strict';

const fs = require('fs');
const path = require('path');

require('chai').should();
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const dateformat = require('dateformat');

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