'use strict';

const DateService = require('../lib/services/dateService');

describe('Testing date service', function() {

    const dateServiceInstance = new DateService();

    describe('Testing dateService:getDate', function () {
        it('should ....', function() {
           dateServiceInstance.getDate().should.have.property('_isAMomentObject').which.is.okey;
        });
    });

    describe('Testing dateService:check', function () {

    });

    describe('Testing dateService:defineModel', function () {

    })
});