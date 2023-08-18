const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const webLog = require('./log/webLog')

const indexRouter = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(indexRouter);

app.use(async (req, res, next) => {
    webLog(req, res, next);
    res.status(200).send("<html lang='en'><head><title>404</title></head><body><p>Maintenance</p></body></html>");
})

module.exports = app;
