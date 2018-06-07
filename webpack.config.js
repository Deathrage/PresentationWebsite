const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: ['babel-polyfill', './src/app.js', './src/scss/main.scss'],
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist")
    },
    mode: 'development',
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ // define where to save the file
          filename: '[name].css',
          allChunks: true,
        }),
    ]
};
  
module.exports = config;