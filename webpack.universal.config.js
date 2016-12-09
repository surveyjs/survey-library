'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = function(options) {
    var babelConfig =  {
        presets: [
            'latest',
            'stage-0',
            'react'
        ],
        plugins: [
            'transform-react-remove-prop-types',
            'transform-react-constant-elements'
        ]
    };

    var config = {
        resolveLoader: {root: path.join(__dirname, 'node_modules')},
        resolve: {
            alias: {
                'react': 'preact-compat',
                'react-dom': 'preact-compat'
            },
            extensions: ['', '.ts', '.tsx']
        },
        entry: {},
        output: {
            filename: '[name].js',
            library: 'Survey',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            preLoaders: [
                { test: /\.(js|jsx)$/, loader: "source-map-loader" }
            ],
            loaders: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loaders:[
                        require.resolve('babel-loader') + '?' + JSON.stringify(babelConfig), // TODO why do we need it
                        require.resolve('ts-loader')
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: require.resolve('babel-loader'),
                    exclude: /node_modules/,
                    query: babelConfig
                }
            ]
        },
        debug: true,
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.ProvidePlugin({
                __extends: path.join(__dirname, 'src', 'extends.ts'),
                __assign: path.join(__dirname, 'src', 'assign.ts')
            })
        ],
        devtool: 'inline-source-map'
    };

    config.entry[options.bundleName] = path.resolve(__dirname, options.entryPoint);

    return config;
};

