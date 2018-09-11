const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");
const DB        = require("../bin/database");
const Functions = require("../bin/functions");
const UIDGenerator = require("uid-generator");

const sanitizer = Functions.sanitizer;

const { check, validationResult } = require('express-validator/check');



router.get("/session", function(req, res, next) {
    const session = req.session;
    //console.log(session);
    if (session.user) {
        res.send({loggedIn: true, session: session.user});
    } else {
        res.status(210);
        res.json({
            loggedIn: false,
        })
    }
});

router.post("/session/auth", multer().fields([]), [
    check("email").isEmail(),
    check("password").escape()
], async function(req, res, next) {

    let results = {},
        sql = "",
        params = {},
        promiser = {};

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //input validation failed.
        return res.status(422).json({ errors: errors.array() });
    } else {
        params.selectors = [
            "user_account_id", "user_date_created", "user_email",
            "user_id", "user_last_updated", "user_profile_id",
            "user_rights", "user_token"
        ].join(",");
        params.email = req.body.email;
        params.password = req.body.password;

        sql = `SELECT ${params.selectors}
               FROM pkt_user
               WHERE user_email = :email
                 AND user_password_hash = SHA2(CONCAT(:password, user_salt), 256) LIMIT 1`;

        promiser = await DB.queryp([sql, params], false)
            .catch(err => results.error = err);
        if (promiser.results) {
            let data = JSON.parse(JSON.stringify(promiser.results))[0];
            data = sanitizer(data);

            const token = await new UIDGenerator(256).generate();
            const key   = data.token;

            sql = `INSERT INTO pkt_sessions (session_token, session_key, session_created, session_ip) VALUES (:token, :key, NOW(), :ip);`;
            params = {
                key: key,
                token: token,
                ip: req.connection.remoteAddress
            };

            promiser = await DB.queryp(sql, params, false)
                .catch(err => results.error = err);

            if (typeof results.error === "undefined") {
                data.token = token;
                results.loggedIn = true;
                results.session = data;
                req.session.user = data;
            }
        }

        return res.json(results);
    }
    if (false) {
        let sql = "SELECT * FROM `pkt_user` WHERE user_email = :email AND user_password_hash = SHA2(CONCAT(:password , `user_salt`),256) LIMIT 1";
        let params = { email: "", password: "", };
        Object.assign(params, req.body);
        let promise = await DB.queryp(sql, params, false)
            .catch(err => res.json({error: err}));
        //let promise = await DB.queryp(`CALL login('${req.body.email}', '${req.body.password}')`, false)
        //    .catch(err => res.send(err));

        if (promise.results.length > 0) {
            //console.log(promise.results[0]);
            let userRow = promise.results[0];
            if (userRow) {
                const token = await new UIDGenerator(256).generate();
                const key   = userRow.user_token;
                Object.assign(userRow, {
                    user_password_hash: undefined,
                    user_salt: undefined,
                    user_token: token,
                });

                sql = "INSERT INTO pkt_sessions (session_token, session_key, session_created, session_ip) VALUES (:token, :key, NOW(), :ip);";
                params = {
                    key: key,
                    token: token,
                    ip: req.connection.remoteAddress
                };
                promise = await DB.queryp([sql, params], false)
                    .catch(err => res.json({error: err}));
                //console.log(promise);
                req.session.user = userRow;
                return res.json({loggedIn: true, session: userRow});
            } else {
                return res.json({error: "Incorrect username or password."})
            }
        } else {
            return res.json({error: "Incorrect username or password."})
        }
    }
});

router.get("/session/cities", async function(req, res, next) {
    if (req.session.user) {
        if (req.session.user.client_cities) {
            let dataset = req.session.user.client_cities.map(function(city) {
                return DB.queryp(`SELECT * FROM hc_cities WHERE city_id = ${city}`);
            });

            Promise.all(dataset).then(await function(results) {
                results = results.map(data => data.results[0]);
                results = results.map(data => ({name: data.city_name, state: data.city_state, folder: data.city_folder}));
                res.send(results);
            }).catch(err => res.status(500).send({error: err}));
        }
    } else {
        res.status(403).send("Unauthorized.");
    }
});


module.exports = router;