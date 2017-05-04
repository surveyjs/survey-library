'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dts = require('dts-bundle');
var rimraf = require('rimraf');
var GenerateJsonPlugin = require('generate-json-webpack-plugin');
var packageJson = require('./package.json');
var fs = require('fs');

var banner = [
    "surveyjs - Survey JavaScript library v" + packageJson.version,
    "Copyright (c) 2015-2017 Devsoft Baltic OÜ  - http://surveyjs.org/",
    "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

// TODO add to dts_bundler
var dts_banner = ["Type definitions for Survey JavaScript library v" + packageJson.version,
    "Project: http://surveyjs.org/",
    "Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>",
    ""].join("\n");

var platformOptions = {
    'react': {
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
            }
        },
        keywords: ['react', 'react-component'],
        dependencies: { 'react': '^15.0.1', 'react-dom': '^15.0.1' }
    },
    'knockout': {
        externals: {
            'knockout': {
                root: 'ko',
                commonjs2: 'knockout',
                commonjs: 'knockout',
                amd: 'knockout'
            }
        },
        keywords: ['knockout'],
        dependencies: {'knockout': '^3.4.0'}
    },
    'jquery': {
        externals: {
            'jquery': {
                root: 'jQuery',
                commonjs2: 'jquery',
                commonjs: 'jquery',
                amd: 'jquery'
            }
        },
        keywords: ['jquery', 'jquery-plugin'],
        dependencies: { 'jquery': '>=1.12.4', '@types/react': '15.0.21' }
    },
    'angular': {
        externals: {},
        keywords: ['angular', 'angular-component'],
        dependencies: { '@types/react': '15.0.21' }
    },
    'vue': {
        externals: {
            'vue': {
                root: 'Vue',
                commonjs2: 'vue',
                commonjs: 'vue',
                amd: 'vue'
            }
        },
        keywords: ['vue'],
        dependencies: { 'vue': "^2.1.10" }
    }
};

module.exports = function (options) {
    //TODO
    options.platformPrefix = options.platform == 'knockout' ? 'ko' : options.platform;
    var packagePath = './packages/survey-' + options.platform + '/';
    var extractCSS = new ExtractTextPlugin({ filename: packagePath + 'survey.css' });

    var percentage_handler = function handler(percentage, msg) {
        if ( 0 === percentage ) {
            console.log('Build started... good luck!');
        } else if ( 1 === percentage ) {
            if (options.buildType === "prod") {
                dts.bundle({
                    name: '../../survey.' + options.platformPrefix,
                    main: packagePath + 'typings/entries/' + options.platform + '.d.ts',
                    outputAsModuleFolder: true,
                    headerText: dts_banner
                });
                rimraf.sync(packagePath + 'typings');
                fs.createReadStream('./npmREADME.md').pipe(fs.createWriteStream(packagePath + 'README.md'));
            }
            //TODO someday need to remove
            if (options.platform === "knockout") {
                if (options.buildType === "prod") {
                    fs.rename('./packages/survey-knockout/survey.knockout.min.js', './packages/survey-knockout/survey.ko.min.js');
                } else {
                    fs.rename('./packages/survey-knockout/survey.knockout.js', './packages/survey-knockout/survey.ko.js');
                }
            }
        }
    };

    var packagePlatformJson = {
        'name': 'survey-' + options.platform,
        'version': packageJson.version,
        'description': 'survey.js is a JavaScript Survey Library. It is a modern way to add a survey to your website. It uses JSON for survey metadata and results.',
        'keywords': [
            'Survey',
            'JavaScript',
            'Bootstrap',
            'Library'
        ].concat(platformOptions[options.platform].keywords),
        'homepage': 'https://surveyjs.org/',
        'license': 'MIT',
        'files': [
            'survey.css',
            'survey.' + options.platformPrefix + '.d.ts',
            'survey.' + options.platformPrefix + '.js',
            'survey.' + options.platformPrefix + '.min.js'
        ],
        'main': 'survey.' + options.platformPrefix + '.min.js',
        'repository': {
            'type': 'git',
            'url': 'https://github.com/surveyjs/surveyjs.git'
        },
        'typings': 'survey.' + options.platformPrefix + '.d.ts',
        'dependencies': platformOptions[options.platform].dependencies
    };

    var config = {
        entry: {},
        resolve: {
            extensions: ['.ts', '.js', '.tsx', '.scss'],
            alias: {
                tslib:  path.join(__dirname, './src/entries/chunks/helpers.ts'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            'declaration': options.buildType === 'prod',
                            'outDir': packagePath + 'typings/'
                        },
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        esModule: true
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
        externals: platformOptions[options.platform].externals,
        plugins: [
            new webpack.ProgressPlugin(percentage_handler),
            new webpack.DefinePlugin({
                "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
                "process.env.VERSION": JSON.stringify(packageJson.version)
            }),
            extractCSS
        ],
        devtool: 'inline-source-map'
    };

    if (options.platform === 'angular' || options.platform === 'jquery') {
        config.resolve.alias['react'] = 'preact-compat';
        config.resolve.alias['react-dom'] = 'preact-compat';

        // TODO because of preact-compat https://github.com/developit/preact-compat/issues/192 need to better decision
        config.module.rules.push({
            loader: 'babel-loader',
            include: [
                path.join(__dirname, './node_modules/preact-compat/src'),
            ],
            options: {
                presets: [
                    ['latest', { modules: false }],
                ],
            },
        });
        // EO TODO
    }

    if (options.buildType === 'prod') {
        config.devtool = false;
        config.plugins = config.plugins.concat([
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.BannerPlugin(banner),
            new GenerateJsonPlugin(
                packagePath + 'package.json',
                packagePlatformJson,
                undefined,
                2
            )
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
