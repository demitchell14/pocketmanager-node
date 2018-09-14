const express = require("express");
//const Request = require("express/lib/request");
//const Response = require("express/lib/response");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");
const DB        = require("../../bin/database");

const Functions = require("../../bin/functions");
const sanitizer = Functions.sanitizer;


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

const getEntryTypes = async function(token) {
    let results = {},
        sql = "",
        params = {},
        promiser;

    results = await getUser(token)
        .catch(err => results.error = err);

    if (typeof results.user !== "undefined") {
        params = {
            userId: results.user.id,
            accountId: results.user.accountId,

            selectors: [
                ["entry_type_id as id", "entry_type_name as text", "entry_type_icon as icon", "entry_type_desc as description"
                ].map(each => each.match(/^[a-zA-Z0-9_]*$/) ? "pkt_entry_type." + each : each).join(","),

            ].join(",")
        };
        sql = `SELECT ${params.selectors} FROM pkt_entry_type WHERE pkt_entry_type.entry_type_account = :accountId`;

        promiser = await DB.queryp([sql, params], false)
            .catch(err => results.error = err);


        if (promiser.results) {
            let entries = sanitizer(JSON.parse(JSON.stringify(promiser.results)));

            entries.map(ent => ent.btnClass = "btn btn-primary btn-sm co1l-12 col-s1m-auto")
            entries.map(ent => ent.icon = ent.icon + " fa-fw offcenter-icon");
            results.entryTypes = entries;
        }

    }


    console.debug(`./routes/api/getentrytypes.js [GET] /v1/api/entrytypes.json`);
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
        return await res.json({
            requestTime: moment().format(),
            isHttpRequestResponse: isHttp(req, res),
            isHttpRequest: isHttp(req),
            isHttpResponse: isHttp(undefined, res),
            isTokenRequest: isHttp(req.headers.token),
            tokenRequest: req.headers.token,
            response: await getEntryTypes(req.headers.token),
        });
    } else return await getEntryTypes(req);

};
