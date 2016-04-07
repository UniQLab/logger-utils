'use strict';

const moment = require('moment');

const DateService = require('../lib/services/dateService');

describe('Testing date service', function() {

    let dateServiceInstance;

    beforeEach(function() {
        dateServiceInstance = new DateService();
    });

    describe('Testing dateService:getDate', function () {
        it('Should return a date which is a moment object', function() {
           dateServiceInstance.getDate().should.have.property('_isAMomentObject').which.is.ok;
        });
    });

    describe('Testing dateService:_defineModel', function () {
        it('Should return an object with state === false, date === undefined', function() {
            dateServiceInstance._defineModel(false).should.have.property('state').which.is.false;
        });
        it('Should return an object with state === true, date === date', function() {
            const date = new Date();
            const model = dateServiceInstance._defineModel(true, date);

            model.should.have.property('state').which.is.ok;
            model.should.have.property('date').equals(date);
        });
    });

    describe('Testing dateService:check', function () {
        it('Should return false, because _date was unchanged', function() {
            dateServiceInstance.check().should.have.property('state').which.is.false;
            dateServiceInstance.check().should.have.property('date').which.is.undefined;
        });
        it('Should return {state: true, date: new Date()}, because currentYear !== currentYear - 1', function() {
            const date = new Date();
            date.setYear(date.getFullYear() - 1);
            const dateInPast = moment(date.getTime());
            dateServiceInstance._date = dateInPast;
            const checkResult = dateServiceInstance.check();

            checkResult.should.have.property('state').which.is.true;
            checkResult.should.have.property('date').which.is.equal(dateServiceInstance.getDate());
        });
        it('Should return {state: true, date: new Date()}, because currentMonth !== currentMonth - 1', function() {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const dateInPast = moment(date.getTime());
            dateServiceInstance._date = dateInPast;
            const checkResult = dateServiceInstance.check();

            checkResult.should.have.property('state').which.is.true;
            checkResult.should.have.property('date').which.is.equal(dateServiceInstance.getDate());
        });
        it('Should return {state: true, date: new Date()}, because currentDate !== currentDate - 1', function() {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const dateInPast = moment(date.getTime());
            dateServiceInstance._date = dateInPast;
            const checkResult = dateServiceInstance.check();

            checkResult.should.have.property('state').which.is.true;
            checkResult.should.have.property('date').which.is.equal(dateServiceInstance.getDate());
        });
    });
});