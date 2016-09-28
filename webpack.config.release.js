'use strict';

const webpack = require('webpack');
const path = require('path');
const commonConfig = require('./webpack.config');

module.exports = (options) => {
    const releaseConfig = Object.create(commonConfig(options));
    releaseConfig.output.path += '/release';
    releaseConfig.debug = false;
    releaseConfig.devtool = 'sourcemap';
    releaseConfig.plugins = releaseConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   }
        // }), // TODO problem with this config need to uncomment and fix
        new webpack.optimize.OccurenceOrderPlugin(true)
    );

    return releaseConfig;
};