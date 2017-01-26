'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var banner = require('./copyright');
var dts = require('dts-bundle');
var rimraf = require('rimraf');

module.exports = function(options) {
    var packagePath = './packages/survey-' + options.platform + '/';
    var extractCSS = new ExtractTextPlugin({ filename: packagePath + 'survey.css' });

    var percentage_handler = function handler(percentage, msg) {
        if ( 0 == percentage ) {
            console.log("Build started... good luck!");
            rimraf.sync(packagePath);
        } else if ( 1 == percentage ) {
            dts.bundle({
                name: '../../survey.' + options.platform,
                main: packagePath + 'typings/entries/' + options.platform + '.d.ts',
            });
            rimraf.sync(packagePath + 'typings');
        }
    };

    var config = {
        entry: {},
        resolve: {
            extensions: ['.ts', '.tsx', '.scss']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            'declaration': options.buildType === 'dev', // TODO need change to prod !!!
                            'outDir': packagePath + 'typings/'
                        }
                    }
                },
                {
                    test: /\.scss$/,
                    loader: extractCSS.extract({
                        fallbackLoader: 'style-loader',
                        loader: 'css-loader!sass-loader'
                    })
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                }
            ]
        },
        output: {
            filename: packagePath + '[name]' + (options.buildType === 'prod' ? '.min': '') + '.js',
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
            extractCSS,
            new webpack.ProvidePlugin({
                __extends: path.join(__dirname, './src', 'extends.ts'),
                __assign: path.join(__dirname, './src', 'assign.ts')
            }),
            new webpack.ProgressPlugin(percentage_handler)
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
        config.plugins = config.plugins.concat([
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.BannerPlugin(banner)
        ]);
    }

    if (options.buildType === 'dev') {
        config.plugins = config.plugins.concat([
            new webpack.LoaderOptionsPlugin({ debug: true})
        ]);
    }

    config.entry['survey.' + options.platform] = path.resolve(__dirname, './src/entries/' + options.platform);

    return config;
};