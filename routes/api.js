const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const DB        = require("../bin/database");

const { check, validationResult } = require('express-validator/check');


router.get("/", function(req, res, next) {
    //res.send("Hello World!");


    res.send("Hello World!");
});

router.get("/vendors.json", async function(req, res, next) {
    if (req.session.user) {
        let vendors = req.session.user.client_vendors;
        try {
            vendors = JSON.parse(vendors);
        } catch (err) {}
        let results = [];
        const tmpl = {
            vendor_ip: undefined,
            vendor_ips: undefined,
            vendor_clients: undefined,
            vendor_superuser: undefined,
        }
        if (typeof vendors === 'object' && vendors instanceof Array) {
            let querystring = "SELECT * FROM vendor WHERE ";

            // -- instead of making multiple calls to the database, we combine all vendor IDs
            // -- from client into one query.
            vendors.map(vendor => querystring += `vendor_id = ${vendor} OR `);
            querystring = querystring.substring(0, querystring.lastIndexOf("OR"));

            const query = await DB.queryp(querystring);
            results = query.results;

            // -- Removes all fields that shouldn't be visible to end user
            results.map(vendor => Object.assign(vendor, tmpl));
            res.json(results);
        } else {
            res.json({error: "No vendors."})
        }
    } else {
        res.status(403);
        res.send("Unauthorized.");
    }
});

//router.post("/generate/vendor", Generators.generateVendor);


/**
 * ./session handles all requests pointed at /v1/api/session/{*}
 */
router.use(require("./session"));

/**
 * ./generators handles all requests pointed at /v1/api/generate/{*}
 */
router.use(require("./generators"));

module.exports = router;