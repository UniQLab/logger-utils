'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const testingConfig = require('./testingConfig');

const PATH_TO_LOGS_FOLDER = testingConfig.PATH_TO_LOGS_FOLDER;

module.exports = {
    checkIfExists(directory) {
        return new Promise((resolve, reject) => {
            fs.stat(directory, (err, stats) => {
                if (err) return resolve(false);
                if (stats.isDirectory()) {
                    if (err) return reject(err);
                    return resolve(true);
                } else {
                    throw new Error('Path already exists, but it is not a directory');
                }
            });
        });
    },
    logsDirectoryRemover(done) {
        return this.checkIfExists(PATH_TO_LOGS_FOLDER).then((exists) => {
            if (exists) {
                return rimraf(PATH_TO_LOGS_FOLDER, () => {
                    return done();
                });
            }
            return done();
        }, err => {
            if (err) return done();
        });
    }
};