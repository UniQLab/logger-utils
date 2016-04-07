'use strict';

const path = require('path');

const moment = require('moment');

const PathService = require('../lib/services/pathService');
const testingConfig = require('./testHelpers/testingConfig');

describe('Testing path service', function() {

    const FORMAT_SCHEMA = 'DD-MM-YYYY';

    const folderMeta = {root: testingConfig.PATH_TO_LOGS_FOLDER};
    const fileMeta = {
        prefix: 'log-',
        extension: '.log'
    };
    const currentDate = new Date();
    const currentMomentDate = moment(currentDate.getTime());
    const CURRENT_MONTH = currentDate.getMonth() + 1;
    const CURRENT_YEAR = currentDate.getFullYear();

    const folder = path.join(
        testingConfig.PATH_TO_LOGS_FOLDER,
        CURRENT_YEAR.toString(),
        CURRENT_MONTH.toString()
    );

    const file = `${fileMeta.prefix}${currentMomentDate.date()}(${currentMomentDate.format(FORMAT_SCHEMA)})${fileMeta.extension}`;
    const filePath = path.join(folder, file);

    describe('Testing pathService:_init', function () {
        it('Should return a path model {folder, file, path}', function() {
            const pathServiceInstance = new PathService(folderMeta, fileMeta);

            pathServiceInstance.root.should.have.property('folder').equals(folder);
            pathServiceInstance.root.should.have.property('file').equals(file);
            pathServiceInstance.root.should.have.property('path').equals(filePath);
        });
    });

    describe('Testing pathService:_defineModel', function () {
        const pathServiceInstance = new PathService(folderMeta, fileMeta);

        const model = pathServiceInstance._defineModel(folder, file);

        model.should.have.property('folder').equals(folder);
        model.should.have.property('file').equals(file);
        model.should.have.property('path').equals(filePath);
    });

    describe('Testing pathService:build', function () {
        const pathServiceInstance = new PathService(folderMeta, fileMeta);

        pathServiceInstance.build().should.be.a('string').equals(filePath);
    });
});