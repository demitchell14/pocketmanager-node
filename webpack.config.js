const path = require('path');
const moment= require('moment');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let version = function() {
    let versionFile = path.resolve(__dirname, './package.json');
    versionFile = fs.readFileSync(versionFile);
    let ver = versionFile.toString();
    let data = JSON.parse(ver);

    ver = data.version + "_" + moment().format();
    return {
        version: ver
    }
};

const exports1 = {
    entry: './source/javascript/app.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'assets/[name].bundle.js',
        chunkFilename: "assets/[name].bundle.js"
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: './source/public/app.html',
            //inject: false,
            version: version().version
        }),
        new CopyWebpackPlugin([
            {   from: './source/public/',
                to: "."
            },
            /*{   from: './source/public/livereload.js',
                to: "livereload.js"
            }*/
        ])
    ],
    module: {
        rules: [
            {
                test: /\.js[x]$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    }
};

let htmlDistibutor = function(files) {
    return files.map(function(file) {
        return new HtmlWebpackPlugin({
            filename: file,
            template: `./source/public/${file}`
        })
    })
};


module.exports = exports1;