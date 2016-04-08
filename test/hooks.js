'use strict';

require('chai').should();
const directoryHelpers = require('./testHelpers/directoryHelpers');

after(function(done) {
    directoryHelpers.logsDirectoryRemover(done);
});