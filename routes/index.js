require('dotenv').config();
const express = require('express');
const router = express.Router();

const webLog = require('../log/webLog');
const path = require("path");

// GET
router.get('/auth', webLog, async (req, res) => {
  const {username, password} = req.query
  if ((username && username==="admin") && (password && password==="admin")) {
    res.status(200).redirect("/xyz-authenticated");
  }else {
    res.status(403).redirect("/login");
  }

});

router.get('/xyz-authenticated', webLog, async (req, res) => {
  res.status(200).sendFile(path.join(process.env.LOG_PATH,"web-honeypot", "views", "auth.html"))
});


router.get('/login', webLog, async (req, res) => {
  res.status(200).sendFile(path.join(process.env.LOG_PATH,"web-honeypot", "views", "login.html"));
});

router.get('/', webLog, async (req, res) => {
  res.status(200).sendFile(path.join(process.env.LOG_PATH,"web-honeypot", "views", "index.html"));
});

// POST
router.post('/*', (req, res) => {
  const max = 1000;
  const data = [];
  for (let i = 0; i < 128; i++) data.push(Math.floor(Math.random() * max));
  res.status(200).json({data: data})
});
module.exports = router;
