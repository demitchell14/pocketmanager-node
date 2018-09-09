const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const DB        = require("../bin/database");

const { check, validationResult } = require('express-validator/check');


router.post("/generate/vendor", multer().fields([]), async function(req, res, next) {
    res.send(req.body);
});


module.exports = router;