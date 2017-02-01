var webpackConfigCreator = require('./webpack.config');
var webpackConfig = webpackConfigCreator({ platform: "knockout", buildType: "dev" });

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['qunit', 'commonjs'],
        files: [
            'tests/entries/*.ts'
        ],
        exclude: [
        ],
        mime: {
            'text/x-typescript': ['ts','tsx']
        },
        coverageReporter: {
            dir:'tmp/coverage/',
            reporters: [
                { type: 'json', subdir: 'report-json' },
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' }
            ]
        },
        junitReporter: {
            outputDir: 'tmp/testresults/',
            outputFile: 'test-results.xml'
        },
        preprocessors: {
            '**/*.ts': ['webpack', 'sourcemap', 'commonjs', 'coverage']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ['progress', 'dots', 'junit', 'coverage'],
        browsers: ['PhantomJS'],
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,
        autoWatch: true,
        singleRun: false,
        concurrency: Infinity
    })
};