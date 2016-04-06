'use strict';

const path = require('path');

module.exports = {
    PATH_TO_LOGS_FOLDER: path.join(__dirname, '../../logs'),

    FILE_TRANSPORT_STRING: 'query => {\n\t\t\tfs.createWriteStream(this.pathService.build(), {\n\t\t\t\tflags: \'a\',\n\t\t\t\tencoding: \'utf8\',\n\t\t\t\tmode: 0o666\n\t\t\t}).write(`${query.output}\\n`);\n\t\t}',
    CONSOLE_TRANSPORT_STRING: 'query => console.log(query.output)'
};