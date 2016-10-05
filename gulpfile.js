"use strict";

/*global require*/
const gulp = require('gulp'),
    concat = require("gulp-concat-util"),
    ts = require('gulp-typescript'),
    insert = require('gulp-insert'),
    gnf = require('gulp-npm-files'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    qunit = require("gulp-qunit"),
    serve = require("gulp-serve"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    html2ts = require("gulp-html-to-ts"),
    sequence = require("gulp-sequence"),
    jsonTransform = require('gulp-json-transform'),
    project = require("./project.json"),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    webpackReleaseConfig = require('./webpack.config.release');

const Server = require("karma").Server;

const libraryVersion = "0.9.12";

const paths = {
    webroot: "./" + project.webroot + "/",
    dist: "./dist/",
    dist_dts: "./dist/typings/",
    tsTests: "./tests/*.ts",
    package_ko: "./packages/survey-knockout/",
    package_react: "./packages/survey-react/",
    typings: "./typings/**/*.d.ts",
    styles: "./src/*.scss",
};
paths.jsFolder = paths.webroot + "js/";
paths.testsFolder = paths.webroot + "tests/";

const copyright = ["/*!",
    "* surveyjs - Survey JavaScript library v" + libraryVersion,
    "* (c) Andrew Telnov - http://surveyjs.org/",
    "* License: MIT (http://www.opensource.org/licenses/mit-license.php)",
    "*/", "", ""].join("\n");

const tdHeader = ["// Type definitions for Survey JavaScript library v" + libraryVersion,
    "// Project: http://surveyjs.org/",
    "// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>",
    "",""].join("\n");

const config_ko_standard = {
    name: "survey-knockout",
    keywords: ["Knockout"],
    dependencies: {"knockout": "^3.4.0"},
    templates: [{ path: ["./src/knockout/templates/*.html", "./src/knockout/standard/templates/*.html"], fileName: "template.ko.html", dest: "./src/knockout/standard/" },
        { path: "./src/knockout/standard/templates.window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/standard/" }],
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/cssstandard.ts", "./src/knockout/*.ts", "./src/knockout/standard/*.ts"],
    mainJSfile: "survey.js",
    dtsfile: "survey.d.ts",
    packagePath: "./packages/survey-knockout/",
    bundleName: "koStandardBundle",
    entryPoint: "src/koStandardIndex",
    outputDir: "bundles"
};
const config_ko_bootstrap = {
    name: "survey-knockout-bootstrap",
    keywords: ["Knockout", "Bootstrap"],
    dependencies: { "knockout": "^3.4.0", "bootstrap": "^3.3.6" },
    templates: [{ path: ["./src/knockout/templates/*.html", "./src/knockout/bootstrap/templates/*.html"], fileName: "template.ko.html", dest: "./src/knockout/bootstrap/" },
        { path: "./src/knockout/bootstrap/templates.window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/bootstrap/" }],
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/cssbootstrap.ts", "./src/knockout/*.ts", "./src/knockout/bootstrap/*.ts"],
    mainJSfile: "survey.bootstrap.js",
    dtsfile: "survey.d.ts",
    packagePath: "./packages/survey-knockout-bootstrap/",
    bundleName: "koBootstrapBundle",
    entryPoint: "src/koBootstrapIndex",
    outputDir: "bundles"
};
const config_react_standard = {
    name: "survey-react",
    keywords: ["react", "react-component"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1" },
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/cssstandard.ts", "./src/react/*.tsx", "./src/react/standard/*.tsx"],
    mainJSfile: "survey.react.js",
    dtsfile: "survey-react.d.ts",
    packagePath: "./packages/survey-react/",
    bundleName: "reactStandardBundle",
    entryPoint: "src/reactStandardIndex",
    outputDir: "bundles"
};

const config_react_bootstrap = {
    name: "survey-react-bootstrap",
    keywords: ["react", "react-component", "Bootstrap"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1", "bootstrap": "^3.3.6" },
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/cssbootstrap.ts", "./src/react/*.tsx", "./src/react/bootstrap/*.tsx"],
    mainJSfile : "survey.react.bootstrap.js",
    dtsfile: "survey-react-bootstrap.d.ts",
    packagePath: "./packages/survey-react-bootstrap/",
    bundleName: 'reactBootstrapBundle',
    entryPoint: "src/reactBootstrapIndex",
    outputDir: "bundles"
};

const config_test_ko = {
    dtsfile: "survey.d.ts",
    src: "./tests/ko/*.ts",
    mainJSfile: "survey.tests.ko.js",
    htmlFile: "./tests/ko/index_tests_ko.html"
};

const configs = {};
configs["ko_standard"] = config_ko_standard;
configs["ko_bootstrap"] = config_ko_bootstrap;
configs["react_standard"] = config_react_standard;
configs["react_bootstrap"]= config_react_bootstrap;
const testconfigs = {};
testconfigs["ko"] = config_test_ko;


function buildTemplates(configName, index) {
    const curConfig = configs[configName];
    const curTemplate = curConfig.templates[index];
    return gulp.src(curTemplate.path)
        .pipe(concat(curTemplate.fileName))
        .pipe(html2ts())
        .pipe(insert.transform(function(contents, file) {
            contents = contents.slice(0, -1); //remove last symbol '}'
            contents = contents.replace('module template.window.ko { ', '');
            return contents.replace('module template.ko { ', '');
        }))
        .pipe(gulp.dest(curTemplate.dest));
}
function buildFromSources(configName) {
    const curConfig = configs[configName];
    // return gulp.src(curConfig.entryPoint)
    //     .pipe(webpackStream(webpackConfig(curConfig), webpack))
    //     .pipe(gulp.dest('./bundles'));
    //Build js file
    const tsResult = gulp.src([
        paths.webroot + "/lib/survey/**/*.d.ts",
        paths.typings
    ].concat(curConfig.src))
        .pipe(insert.prepend(copyright))
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            noImplicitAny: false,
            declarationFiles: true,
            jsx: "react"
        }));
    return tsResult.js
        .pipe(concat(curConfig.mainJSfile))
        .pipe(sourcemaps.write({ sourceRoot: "src" }))
        //Source map is a part of generated file
        .pipe(gulp.dest(paths.dist))
        .pipe(gulp.dest(paths.jsFolder))
        .pipe(gulp.dest(curConfig.packagePath + "dist/"));
}

function buildTypeDefinition(configName) {
    const curConfig = configs[configName];
    //Build js file
    //Build typescript definition
    const tscResult = gulp.src([
        paths.webroot + "/lib/survey/**/*.d.ts",
        paths.typings
    ].concat(curConfig.src))
        .pipe(ts({
            target: "ES5",
            noExternalResolve: true,
            declaration: true,
            jsx: "react"
        }));
    return tscResult.dts
        .pipe(concat(curConfig.dtsfile))
        .pipe(concat.header(tdHeader))
        .pipe(gulp.dest(paths.dist_dts));
}

function compressMainJS(configName) {
    const curConfig = configs[configName];
    //Compress
    gulp.src(paths.dist + curConfig.mainJSfile)
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(concat.header(copyright))
        .pipe(gulp.dest(curConfig.packagePath + "dist/"))
        .pipe(gulp.dest(curConfig.packagePath + "js/"))
        .pipe(gulp.dest(paths.dist));
}

function buildTests(configName) {
    const curConfig = testconfigs[configName];
    //Build sources
    const tsResult = gulp.src([
        paths.typings,
        paths.tsTests,
        curConfig.src])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: "ES5",
            noImplicitAny: false
        }));

    return tsResult.js
        .pipe(concat(curConfig.mainJSfile))
        .pipe(sourcemaps.write({ sourceRoot: "tests" }))
        //Source map is a part of generated file
        .pipe(gulp.dest(paths.testsFolder));
    //Copy html file
    gulp.src(curConfig.htmlFile)
    // Perform minification tasks, etc here
        .pipe(gulp.dest(paths.testsFolder));
}

function createPackageJson(configName) {
    const curConfig = configs[configName];
    return gulp.src("packagetemplate.json")
        .pipe(jsonTransform(function (data) {
            data.name = curConfig.name;
            data.version = libraryVersion;
            if (curConfig.keywords) {
                for (let i = 0; i < curConfig.keywords.length; i++) {
                    data.keywords.push(curConfig.keywords[i]);
                }
            }
            data.main = curConfig.mainJSfile.replace(".js", ".min.js");
            if (curConfig.dependencies) {
                for (const key in curConfig.dependencies) {
                    data.dependencies[key] = curConfig.dependencies[key];
                }
            }
            return data;
        }, "  "))
        .pipe(rename("package.json"))
        .pipe(gulp.dest(curConfig.packagePath));
}

gulp.task("ko_standard_tempates", function () {
    return buildTemplates("ko_standard", 0);
});
gulp.task("ko_standard_windowtempates", function () {
    return buildTemplates("ko_standard", 1);
});
gulp.task("ko_standard_source", function () {
    buildTypeDefinition("ko_standard");
    return buildFromSources("ko_standard");
});
gulp.task("ko_standard_compress", function () {
    compressMainJS("ko_standard");
});
gulp.task("ko_standard_createPackageJson", function () {
    createPackageJson("ko_standard");
});

gulp.task("build_ko_standard", sequence("ko_standard_tempates", "ko_standard_windowtempates", "ko_standard_source", "ko_standard_compress", "ko_standard_createPackageJson"));

gulp.task("ko_bootstrap_tempates", function () {
    return buildTemplates("ko_bootstrap", 0);
});
gulp.task("ko_bootstrap_windowtempates", function () {
    return buildTemplates("ko_bootstrap", 1);
});
gulp.task("ko_bootstrap_source", function () {
    buildTypeDefinition("ko_bootstrap");
    return buildFromSources("ko_bootstrap");
});
gulp.task("ko_bootstrap_compress", function () {
    compressMainJS("ko_bootstrap");
});
gulp.task("ko_bootstrap_createPackageJson", function () {
    createPackageJson("ko_bootstrap");
});
gulp.task("build_ko_bootstrap", sequence("ko_bootstrap_tempates", "ko_bootstrap_windowtempates", "ko_bootstrap_source", "ko_bootstrap_compress", "ko_bootstrap_createPackageJson"));

gulp.task("buildTests_ko", function () {
    return buildTests("ko");
});

gulp.task("react_standard_source", function () {
    //buildTypeDefinition("react_standard");
    return buildFromSources("react_standard");
});
gulp.task("react_standard_compress", function () {
    compressMainJS("react_standard");
});
gulp.task("react_standard_createPackageJson", function () {
    createPackageJson("react_standard");
});
gulp.task("build_react_standard", sequence("react_standard_source", "react_standard_compress", "react_standard_createPackageJson"));

gulp.task("react_bootstrap_source", function () {
    //buildTypeDefinition("react_bootstrap");
    return buildFromSources("react_bootstrap");
});
gulp.task("react_bootstrap_compress", function () {
    compressMainJS("react_bootstrap");
});
gulp.task("react_bootstrap_createPackageJson", function () {
    createPackageJson("react_bootstrap");
});
gulp.task("build_react_bootstrap", sequence("react_bootstrap_source", "react_bootstrap_compress", "react_bootstrap_createPackageJson"));

gulp.task('copyfiles', function (callback) {
    gulp.src(gnf(null, 'package.json'), { base: './' })
        .pipe(rename(function (path) {
            path.dirname = "";
            path.basename = path.basename.replace("-latest", "");
        }))
        .pipe(gulp.dest(paths.jsFolder));
});

gulp.task('sass', function () {
    "use strict";
    gulp.src(paths.styles)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat("survey.css"))
        .pipe(gulp.dest(paths.webroot + 'css'))
        .pipe(gulp.dest(paths.package_ko + 'dist/css'))
        .pipe(gulp.dest(paths.package_ko + 'css'))
        .pipe(gulp.dest(paths.package_react + 'dist/css'))
        .pipe(gulp.dest(paths.package_react + 'css'))
        .pipe(gulp.dest(paths.dist + 'css'));
});
gulp.task("makedist", sequence(["sass", "build_ko_standard", "build_ko_bootstrap"], "buildTests_ko", "build_react_standard", "build_react_bootstrap"));

gulp.task("test_ci", function (done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done).start();
});

gulp.task("server", serve({
    root: ["wwwroot"],
    port: 30001
}));

// new test tasks
// const gulp = require('gulp');
const gutil = require('gulp-util');

const reactStandardOptions = {
    bundleName: 'reactStandardBundle',
    entryPoint: 'webpack/reactStandardIndex',
    outputDir: 'bundles'
};

const reactBootstrapOptions = {
    bundleName: 'reactBootstrapBundle',
    entryPoint: 'webpack/reactBootstrapIndex',
    outputDir: 'bundles'
};

const koStandardOptions = {
    bundleName: 'koStandardBundle',
    entryPoint: 'webpack/koStandardIndex',
    outputDir: 'bundles'
};

const koBootstrapOptions = {
    bundleName: 'koBootstrapBundle',
    entryPoint: 'webpack/koBootstrapIndex',
    outputDir: 'bundles'
};

let options;

const handleWebpackOutput = (err, stats) => {
    if (err) throw new gutil.PluginError('gulp_err', err);
    gutil.log('[gulp_err]', stats.toString({
        colors: true,
        chunks: false
    }));
};

const getDevCompiler = (options) => {
    return webpack(webpackConfig(options));
};

const getReleaseCompiler = (options) => {
    return webpack(webpackReleaseConfig(options));
};

gulp.task('build:react:standard', () => {
    options = reactStandardOptions;
    build();
});

gulp.task('build:react:bootstrap', () => {
    options = reactBootstrapOptions;
    build();
});

gulp.task('build:ko:standard', () => {
    options = koStandardOptions;
    build();
});

gulp.task('build:ko:bootstrap', () => {
    options = koBootstrapOptions;
    build();
});

function build() {
    gulp.start('build:dev');
}

gulp.task('build:dev', (done) => {
    const compiler = getDevCompiler(options);
    compiler.run((err, stats) => {
        handleWebpackOutput(err, stats);
        done();
    });
});

gulp.task('build:release', (done) => {
    const compiler = getReleaseCompiler(options);
    compiler.run((err, stats) => {
        handleWebpackOutput(err, stats);
        done();
    });
});

gulp.task('watch', ['build:dev'], () => {
    const compiler = getDevCompiler(options);
    compiler.watch({
        aggregateTimeout: 300, // wait so long for more changes
        poll: 2000 // windows needs polling to pick up changes :(
    }, (err, stats) => {
        handleWebpackOutput(err, stats);
    });
});

module.exports = {
    getDevCompiler: getDevCompiler,
    getReleaseCompiler: getReleaseCompiler
};