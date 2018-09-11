/**
 *
 * @param {Object|array} results
 * @param {Object|array} results.account
 * @param {String[]} results.entries
 */
const sanitizer = function(results, target) {
    const handler = function(item) {
        let keys = Object.keys(item).map(key => toCamelCase(key));
        let values = Object.values(item);
        item = {};
        keys.map((entry, idx) => item[entry] = values[idx]);
        return item;
    };
    if (typeof target === "undefined") {
        if (results instanceof Array) {
            let tmp = results;
            //console.log(tmp);
            results = [];
            tmp.map(each => results.push(handler(each)));
        } else {
            results = handler(results);
        }
    }
    return results;
};


let toCamelCase = function(str) {
    str = str.substr(str.indexOf("_")+1);
    str = str.split("_").map((segment, idx) => idx > 0 ?
        (segment.charAt(0).toUpperCase() + segment.substr(1)) : segment).join("");
    return str;
};

module.exports.sanitizer = sanitizer;