const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const DB        = require("../bin/database");
const Functions = require("../bin/functions");
const moment = require("moment");

const AuthorizationService = require("../middleware/authorizationservice");


const { check, validationResult } = require('express-validator/check');

const sanitizer = Functions.sanitizer;

// -- Requires both a token and a session to pass through
const activeAuthorization = AuthorizationService({
    mode: "allow", // {"block", "allow"}
    require: {
        header: ["token"],
        //session: ["user"],
        session: {user: "email"},
    },
});





// --
// --
// --
// -- Routes through ./v1/api
// --
// --
// --

router.get("/", function(req, res, next) {
    //res.send("Hello World!");


    res.send("Hello World!");
});


router.get("/vendors.json", activeAuthorization.middleware, async function(req, res, next) {
    res.send("Hello there!");
});



router.get("/entries.json", activeAuthorization.middleware, require("./api/getentries"));

router.get("/entrytypes.json", /*activeAuthorization.middleware,*/ require("./api/getentrytypes"));

router.get("/user.json", activeAuthorization.middleware, require("./api/getuser"));

// -- ./session handles all requests pointed at /v1/api/session/{*}
router.use(require("./session"));

// -- ./generators handles all requests pointed at /v1/api/generate/{*}
router.use(require("./generators"));


module.exports = router;