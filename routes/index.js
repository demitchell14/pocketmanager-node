const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();


router.get(/^((?!\/(v1|assets|profiles)).*)$/, function(req, res, next) {
    //res.send("Hello World!");

    const app = path.join(__dirname, '../public/app.html');
    let appFile = fs.readFileSync(app, "utf8");
    //console.log(process.env.DEBUG);

    if (process.env.DEBUG) {
        const host = req.headers.host.substr(0, req.headers.host.indexOf(":"));
        appFile += `<script type="text/javascript" src="http://${host}:35729/livereload.js"></script>`
    }

    res.send(appFile);

    //res.sendFile(path.join(__dirname, '../public/app.html'));
});

router.put(/^\/(assets)/, function(req, res, next) {
    if (process.env.PROJECT_ROOT) {
        let profilesPath = path.join(process.env.PROJECT_ROOT + "/backend/public", req.path);
        res.sendFile(profilesPath);
    } else
        res.json({ error: "process.env.PROJECT_ROOT is undefined."});
})

module.exports = router;