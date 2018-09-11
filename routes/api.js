const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const DB        = require("../bin/database");
const Functions = require("../bin/functions");
const moment = require("moment");


const { check, validationResult } = require('express-validator/check');

const sanitizer = Functions.sanitizer;

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

const getUser = async function(token) {
    let sql, results = {},
        params = {},
        promiser;

    params.token = token;
    params.selectors = [

        ["user_account_id", "user_id",
        ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_user." + each  : each).join(","),

        ["session_created", "session_ip",
        ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_sessions." + each  : each).join(","),

        ["CONCAT_WS(' ', profile_name_first, profile_name_last) AS profile_name",
        ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_profile." + each  : each).join(","),

    ].join(",");

    sql = `SELECT ${params.selectors} FROM pkt_user 
                               LEFT JOIN pkt_sessions ON pkt_sessions.session_token = :token 
                               LEFT JOIN pkt_profile ON pkt_profile.profile_id = pkt_user.user_profile_id
               WHERE pkt_user.user_token = pkt_sessions.session_key LIMIT 1;`;

    promiser = await DB.queryp([sql, params], false)
        .catch(err => results = {error: err});

    if (promiser.results) {
        //console.log(promiser.results);
        results.user = sanitizer(JSON.parse(JSON.stringify(promiser.results))[0]);
    } else {
        //console.log(promiser);
        results.error = promiser.error;
    }
    return results;
};

/**
 * @async
 * @param req {Request}
 * @param res {Response}
 * @param [next] {Function}
 * @returns {Promise<void>}
 */
const getEntries = async function(req, res, next) {
    let results = {},
        sql = "",
        params = {},
        promiser;

    results = await getUser(req.headers.token)
        .catch(err => results.error = err);

    if (typeof results.user !== "undefined") {
        params = {
            userId: results.user.id,
            accountId: results.user.accountId,
            selectors: [
                ["entry_id", "entry_start",
                    "entry_end", "entry_break", "entry_details", "entry_invoice",
                ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_entry." + each  : each).join(","),

                ["entry_type_name", "entry_type_desc"
                ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_entry_type." + each  : each).join(","),

                ["client_rate AS client_client_rate",
                ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_client." + each  : each).join(","),

                ["CONCAT_WS(' ', profile_name_first, profile_name_last) AS profile_client_name"
                ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_client_profile." + each  : each).join(","),
            ].join(",")
        };
        sql = `SELECT ${params.selectors} FROM pkt_entry
                  LEFT JOIN pkt_entry_type ON pkt_entry_type.entry_type_id = pkt_entry.entry_type_id
                  LEFT JOIN pkt_client ON pkt_client.client_id = pkt_entry.entry_client_id
                  LEFT JOIN pkt_profile AS pkt_client_profile ON pkt_client_profile.profile_id = pkt_client.client_profile_id
               WHERE pkt_entry.entry_user_id = :userId AND pkt_entry.entry_account_id = :accountId;`;


        promiser = await DB.queryp([sql, params], false)
            .catch(err => results.error = err);

        if (promiser.results) {
            let entries = sanitizer(JSON.parse(JSON.stringify(promiser.results)));


            const prepareEntry = function(entry) {



                // -- Set defaults for times from the query.
                // -- creates a moment object in place or undefined if time is null
                entry.start = entry.start ? moment(entry.start) : undefined;
                entry.end = entry.end ? moment(entry.end) : undefined;
                // -- -----------------
                // -- -----------------

                // -- Redefines all null objects as undefined to
                // -- make passing across http easier
                Object.keys(entry).map((type, idx) => entry[type] === null ? entry[type] = undefined : entry[type]);
                // -- -----------------

                Object.keys(entry).map(type => {

                    // -- Redefines any points with 'rate' in its key name.
                    // -- This is to show multiple rates that are available
                    if (type.match(/rate/i)) {
                        let value = entry[type];
                        //console.log(type.toLowerCase().indexOf("rate"));
                        let tmp = type.substr(0, type.toLowerCase().indexOf("rate"));

                        //console.log(tmp);
                        if (typeof entry.rate !== "object")
                            entry.rate = {};
                        entry[type] = undefined;
                        entry.rate[tmp] = value;
                        //console.log(value);
                    }
                    // -- ------------------
                    // -- End Rate Redefiner
                });

                // -- If there is a rate and both a start and end time are present,
                // -- we will provide a moment duration to send
                if (entry.rate) {
                    entry.duration = {};

                    entry.duration.start = entry.start ? entry.start.format() : undefined;
                    entry.duration.end = entry.end ? entry.end.format() : undefined;
                    entry.duration.break = entry["break"] ? moment.duration(entry["break"]) : undefined;

                    if (entry.end && entry.start)
                        entry.duration.duration = moment.duration(entry.end.diff(entry.start), "milliseconds").subtract(moment.duration(entry["break"]))

                    entry["break"] = undefined;
                    entry.end = undefined;
                    entry.start = undefined;

                    if (entry.start && entry.end && false) {
                        const difference = entry.end.diff(entry.start);
                        entry.duration = {
                            start: entry.start.format(),
                            end: entry.end.format(),
                            restTime: entry["break"],
                            duration: moment.duration(difference, "milliseconds").subtract(moment.duration(entry["break"]))
                        };
                        entry["break"] = undefined;
                        entry.end = undefined;
                        entry.start = undefined;
                    }
                }
                // -- ------------------

                let typeGroupings = ["type", "client"];

                typeGroupings.map(type => {
                    let results = {};
                    let keys = Object.keys(entry).filter(ent => ent.toLowerCase().includes(type));
                    if (typeof entry[type] === "undefined") {
                        entry[type] = {};
                    }
                    keys.map((obj,idx) => {
                        if (obj.indexOf(type) === 0) {
                            let newTag = obj.substr(type.length);
                            newTag = newTag.charAt(0).toLowerCase() + newTag.substr(1);
                            entry[type][newTag] = entry[obj];
                            entry[obj] = undefined;
                        }
                    })
                });

                /*entry.type = {
                    name: entry.typeName,
                    desc: entry.typeDesc,
                };
                entry.typeName = undefined;
                entry.typeDesc = undefined;*/
            };

            entries.map(prepareEntry);
            //console.log(entries);

            results.entries = entries;
        }
    }

    console.debug(`./routes/api.js [GET] /v1/api/entries.json`);
    console.debug(results);
    console.debug(`     //       -----       //`);
    res.json(results);
};



router.get("/entries.json", getEntries);

/**
 * ./session handles all requests pointed at /v1/api/session/{*}
 */
router.use(require("./session"));

/**
 * ./generators handles all requests pointed at /v1/api/generate/{*}
 */
router.use(require("./generators"));


module.exports = router;