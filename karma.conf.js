var webpack = require('webpack');
var webpackConfigCreator = require('./webpack.config');
var webpackConfig = webpackConfigCreator({ platform: "knockout", buildType: "dev" });

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['qunit'],
        files: [
            'tests/entries/*.ts'
        ],
        exclude: [
        ],
        mime: {
            'text/x-typescript': ['ts','tsx']
        },
        browserNoActivityTimeout: 100000,
        junitReporter: {
            outputDir: 'tmp/testresults/',
            outputFile: 'test-results.xml'
        },
        preprocessors: {
            '**/*.ts': ['webpack', 'sourcemap']
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
            plugins: [
                new webpack.SourceMapDevToolPlugin({
                    filename: null, // if no value is provided the sourcemap is inlined
                    test: /\.(ts|js)($|\?)/i // process .js and .ts files only
                })
            ]
        },
        reporters: ['progress', 'dots', 'junit'],
        browsers: ['ChromeHeadless'],
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,
        autoWatch: true,
        singleRun: false,
        concurrency: Infinity
    })
};
