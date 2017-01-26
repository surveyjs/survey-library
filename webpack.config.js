'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var banner = require('./copyright');
var dts = require('dts-bundle');
var rimraf = require('rimraf');
var GenerateJsonPlugin = require('generate-json-webpack-plugin');
var packageJson = require('./package.json');

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
        dependencies: { 'jquery': '>=1.12.4', '@types/react': '0.0.0' }
    },
    'angular': {
        externals: {},
        keywords: ['angular', 'angular-component'],
        dependencies: { '@types/react': '0.0.0' }
    }
};

module.exports = function(options) {
    var packagePath = './packages/survey-' + options.platform + '/';
    var extractCSS = new ExtractTextPlugin({ filename: packagePath + 'survey.css' });

    var percentage_handler = function handler(percentage, msg) {
        if ( 0 == percentage ) {
            console.log('Build started... good luck!');
            rimraf.sync(packagePath);
        } else if ( 1 == percentage ) {
            dts.bundle({
                name: '../../survey.' + options.platform,
                main: packagePath + 'typings/entries/' + options.platform + '.d.ts',
            });
            rimraf.sync(packagePath + 'typings');
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
            'survey.min.css',
            'survey.' + options.platform + '.js',
            'survey.' + options.platform + '.min.js'
        ],
        'main': [
            'survey.min.css',
            'survey.' + options.platform + '.min.js'
        ],
        'repository': {
            'type': 'git',
            'url': 'https://github.com/andrewtelnov/surveyjs.git'
        },
        'typings': 'survey.' + options.platform + '.d.ts',
        'dependencies': platformOptions[options.platform].dependencies
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
                            'declaration': options.buildType === 'prod',
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
        externals: platformOptions[options.platform].externals,
        plugins: [
            extractCSS,
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
            new webpack.ProgressPlugin(percentage_handler),
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