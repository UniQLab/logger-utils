'use strict';

const fs = require('fs');
const path = require('path');

require('chai').should();
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

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

describe('Testing utils/directoryCreatorUtils', function() {

    const directoryCreator = require('../lib/utils/directoryCreatorUtils');

    describe('Testing directoryCreatorUtils.exist', function() {

        afterEach(function(done) {
            logsDirectoryRemover(done);
        });

        it('should return true if directory exists', function(done) {
            const pathToCreate = path.join(pathToLogsFolder, '/testingDirectory');

            mkdirp(pathToCreate, function(err) {
                if (err) {
                    throw err;
                }

                const exists = directoryCreator.exists(pathToCreate);

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

                const exists = directoryCreator.exists(path.join(pathToCreate, '/doesnt/exist'));

                exists.should.be.false;
                done();
            })
        });

    });

    describe('Testing directoryCreatorUtils.create', function() {

        afterEach(function(done) {
            logsDirectoryRemover(done);
        });

        it('should create directory /logs/testing/directory/creation', function(done) {
            const pathToCreate = path.join(pathToLogsFolder, '/testing/directory/creation');

            directoryCreator.create(pathToCreate);

            checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            });
        });

        it('should be okey if directory already exists', function(done) {
            const pathToCreate = pathToLogsFolder + '/testing/directory/creation';

            directoryCreator.create(pathToCreate);
            directoryCreator.create(pathToCreate);

            checkIfExists(pathToCreate).then(exist => {
                exist.should.be.true;
                done();
            }, err => {
                console.log(err);
                done();
            });
        });

    });
});