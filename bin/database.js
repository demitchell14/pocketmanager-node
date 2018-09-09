/**
 * TODO
 * TODO edit connection values to allow for local database connections
 * TODO
 */

const mysql       = require('mysql');


const requiredConnectFields = ["host", "user", "password", "database"];

const connection = {
    DEV: {
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
        queryFormat: function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    //console.log(this.escape(values[key]));
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        }
    }
};

/**
 *
 * @type {{connection: undefined, init: DB.init, connect: (function(*=): *), end: (function(): *), query: (function(*=, *=): *)}}
 */
let connectionOptions = {};
let DB = {
    /**
     * @type {Pool}
     */
    connection: undefined,
    init: function(connection) {
        if (typeof connection === 'object') {
            let fields = Object.keys(connection);
            let required = fields.filter(item => {
                for (let i = 0; i < requiredConnectFields.length; i++) {
                    if (requiredConnectFields[i] === item) return true;
                }
                return false;
            });

            if (required.length >= requiredConnectFields.length) {
                connectionOptions = connection;

                DB.connection = mysql.createPool(connectionOptions);
                console.log("Database Initialized");
                //DB.connection.config

                return DB;
            }
        }
    },
    escape: function(value) {
        return DB.connection.escape(value);
    },
    connect: function(callback) {
        return DB.connection.connect(callback);
    },
    end: function() {
        return DB.connection.end();
    },
    /**
     *
     * @param query {string}
     * @param callback {function(error, result, fields)}
     */
    query: function(query, callback) {
        return DB.connection.query(query, callback);
    },

    /**
     *
     * @param query
     * @param includeFields
     * @returns {Promise<{results: object, fields: object}>}
     */
    queryp: function(query, includeFields) {
        return new Promise((resolve, reject) => {
            const callback = function(error, results, fields) {
                if (error) reject(error);
                else {
                    resolve({
                        results: results,
                        fields: includeFields ? fields : undefined
                    });
                }
            };
            if (typeof query === "object") {
                let tmp = Object.values(query);
                //console.log(tmp);
                DB.connection.query(tmp[0], tmp[1], callback);
            } else
                DB.connection.query(query, callback)
        });
    },

    getConnectionOptions(env) {
        if (env)
            return connection[env.toUpperCase()];
        else return connection.DEV;
    }
};

module.exports = DB;