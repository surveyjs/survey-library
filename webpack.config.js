'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(options) {
    var packagePath = './packages/survey-' + options.platform + '/';
    var config = {
        entry: {},
        resolve: {
            extensions: ['.ts', '.tsx', '.scss']
        },
        module: {
            rules: [
                {
                    loader: 'ts-loader',
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: "style-loader",
                        loader: "css-loader!sass-loader"
                    })
                },
            ]
        },
        output: {
            filename: packagePath + '[name].js',
            library: 'Survey',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        externals: {
            'react': {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            },
            'knockout': {
                root: 'ko',
                commonjs2: 'knockout',
                commonjs: 'knockout',
                amd: 'knockout'
            },
            'jquery': {
                root: 'jQuery',
                commonjs2: 'jquery',
                commonjs: 'jquery',
                amd: 'jquery'
            }
        },
        plugins: [
            new ExtractTextPlugin({ filename: packagePath + 'survey.css' }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.ProvidePlugin({
                __extends: path.join(__dirname, './src', 'extends.ts'),
                __assign: path.join(__dirname, './src', 'assign.ts')
            })
        ],
        devtool: 'inline-source-map'
    };

    if (options.platform === 'angular' || options.platform === 'jquery') {
        config.resolve.alias = {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        };
    }

    if (options.buildType === 'prod') {
        config.devtool = false;
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    if (options.buildType === 'dev') {
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        );
    }

    config.entry['survey.' + options.platform] = path.resolve(__dirname, './src/entries/' + options.platform);

    return config;
}