require('dotenv').config();
const zlib = require('zlib');
const fs = require('fs');

function compressLogFile(inputFile) {
    const fileReadStream = fs.createReadStream(inputFile);
    const fileWriteStream = fs.createWriteStream(inputFile + ".gz");
    const gzip = zlib.createGzip();
    fileReadStream.pipe(gzip).pipe(fileWriteStream);
    fs.unlinkSync(inputFile);
}

module.exports = {compressLogFile}