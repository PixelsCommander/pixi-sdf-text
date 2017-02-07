var pjson = require('./package.json');

var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: pjson.name + '.js',
        sourceMapFilename: pjson.name + ".js.map"
    },
    devtool: "#inline-source-map",
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                //plugins: ['transform-runtime'],
                presets: ['es2015'],
                plugins: ['transform-object-rest-spread']
            }
        },
            {test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/},
            {test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/}
        ]
    },
    plugins: [
        //new Visualizer(),
        /* new uglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        })*/
    ]
}