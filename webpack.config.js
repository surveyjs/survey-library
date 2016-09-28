'use strict';

const path = require('path');

module.exports = (options) => {
    const babelConfig =  {
        presets: [
            [require.resolve('babel-preset-es2015'), { loose: true }],
            require.resolve('babel-preset-react')
        ]
    };

    const config = {
        resolveLoader: {root: path.join(__dirname, 'node_modules')},
        resolve: {
            extensions: ['', '.js', '.ts', '.jsx', '.tsx']
        },
        entry: options.entryPoints,
        output: {
            path: path.join(options.outputDir),
            filename: '[name].js'
        },
        module: {
            loaders: [
                {
                    test: /\.(ts|tsx)$/,
                    loaders:[
                        require.resolve('babel-loader') + '?' + JSON.stringify(babelConfig),
                        require.resolve('ts-loader'),
                    ],
                    include: options.tsInclude
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: require.resolve('babel-loader'),
                    query: babelConfig
                }
            ]
        },
        plugins: [],
        devtool: 'cheap-source-map',
        debug: true,
        eslint: {
            configFile: path.join(__dirname, '.eslintrc')
        }
    };

    return config;
};