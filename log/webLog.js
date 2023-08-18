require('dotenv').config();
const chalk = require('chalk');
const path = require("path");
const fs = require('fs');


const {compressLogFile} = require("./logHandler");

const logPath = `${path.join(process.env.LOG_PATH, 'web_access.log')}`

function consoleWebLog(logObj) {
    console.log(chalk.gray("[") + chalk.white(logObj.date) + chalk.gray("] ") +
        chalk.green(logObj.method) + chalk.gray(" --- ") + chalk.cyan(logObj.ip) + chalk.gray(" --- ") +
        chalk.cyan(logObj.path) + chalk.gray(" --- ") + chalk.cyan(logObj.userAgent) +
        chalk.gray(" --- ") + chalk.cyan(JSON.stringify(logObj.data)) + chalk.gray(" --- ") + chalk.cyan(JSON.stringify(logObj.cookies)) +
        chalk.gray(" --- ") + chalk.cyan(logObj.referer) + chalk.white(""))
}

function addNewEntry(logObj) {
    if (!fs.existsSync(path.dirname(logPath))) {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
    }
    const logStream = fs.createWriteStream(logPath, {flags: 'a'});
    logStream.write(JSON.stringify(logObj) + "\n");
    logStream.end(() => {
        const sizeInMB = fs.statSync(logPath).size / (1024 * 1024);
        if (sizeInMB >= 5) {
            compressLogFile(logPath);
        }
    });
}

module.exports = async function (req, res, next) {
    const datetime = new Date()
    const logObj = {
        date: `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`,
        userAgent: req.headers["user-agent"],
        referer: req.headers.referer ? req.headers.referer : "",
        path: req.originalUrl,
        cookies: req.cookies,
        method: req.method,
        data: req.method==="GET" ? req.query : req.body,
        ip: req.ip
    }
    consoleWebLog(logObj)
    addNewEntry(logObj)
    next();
}