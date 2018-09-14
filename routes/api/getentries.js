const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const DB        = require("../../bin/database");
const moment = require("moment");
const Functions = require("../../bin/functions");
const sanitizer = Functions.sanitizer;

const getUser = require("./getuser");

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

                ["entry_type_name", "entry_type_desc", "entry_type_icon"
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
    return results; //res.json(results);
};


const isHttp = function(req, res) {
    let reqIsRequest = typeof req === "object";
    if (reqIsRequest) {
        reqIsRequest = typeof req.method === "string";
        reqIsRequest = reqIsRequest &&  typeof req.url === "string";
    }
    let resIsResponse = typeof res === "object";
    if (resIsResponse) {

    }

    if (req && res)
        return reqIsRequest && resIsResponse;
    else if (req)
        return reqIsRequest;
    else
        return resIsResponse;
};

/**
 * @async
 * @param req {Request|String}
 * @param res {Response}
 * @param [next] {Function}
 * @returns {Promise<void>}
 */
module.exports =  async function(req, res, next) {

    if (isHttp(req, res)) {
        //let response = ;
        //return await res.json(response);

        return await res.json({
            requestTime: moment().format(),
            isHttpRequestResponse: isHttp(req, res),
            isHttpRequest: isHttp(req),
            isHttpResponse: isHttp(undefined, res),
            isTokenRequest: isHttp(req.headers.token),
            tokenRequest: req.headers.token,
            response: await getEntries(req, res),
        });
    }// else return await getUser(req);
      else return await res.status(404).json({error: "Error"});

};