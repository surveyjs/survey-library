/*global require*/
var gulp = require('gulp'),
    concat = require("gulp-concat-util"),
    ts = require('gulp-typescript'),
    insert = require('gulp-insert'),
    gnf = require('gulp-npm-files'),
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
    getWebpackConfig = require('./webpack.config');

var Server = require("karma").Server;

var libraryVersion = "0.10.0";

var paths = {
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

var copyright = ["/*!",
    "* surveyjs - Survey JavaScript library v" + libraryVersion,
    "* (c) Andrew Telnov - http://surveyjs.org/",
    "* License: MIT (http://www.opensource.org/licenses/mit-license.php)",
    "*/", "", ""].join("\n");

var tdHeader = ["// Type definitions for Survey JavaScript library v" + libraryVersion,
    "// Project: http://surveyjs.org/",
    "// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>",
    "",""].join("\n");

var config_ko = {
    name: "survey-knockout",
    keywords: ["Knockout"],
    dependencies: {"knockout": "^3.4.0"},
    templates: [{ path: ["./src/knockout/templates/*.html", "./src/plugins/knockout/templates/*.html"], fileName: "template.ko.html", dest: "./src/knockout/" },
        { path: "./src/knockout/templates/window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/" }],
    src: [
        "./src/*.ts",
        "./src/localization/*.ts",
        "./src/defaultCss/cssstandard.ts",
        "./src/defaultCss/cssbootstrap.ts",
        "./src/knockout/*.ts",
        "./src/entries/chunks/**/*.ts",
        "./src/plugins/*.ts",
        "./src/plugins/knockout/*.ts",
        "./src/entries/ko.ts"
    ],
    mainJSfile: "survey.ko.js",
    dtsfile: "ko.d.ts",
    packagePath: "./packages/survey-knockout/",
    bundleName: "survey.ko",
    entryPoint: "src/entries/ko"
};

var config_react = {
    name: "survey-react",
    keywords: ["react", "react-component"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1" },
    src: [
        "./src/*.ts",
        "./src/localization/*.ts",
        "./src/defaultCss/*.ts",
        "./src/react/*.tsx",
        "./src/entries/chunks/**/*.ts",
        "./src/plugins/*.ts",
        "./src/plugins/react/*.tsx",
        "./src/entries/react.ts"
    ],
    mainJSfile: "survey.react.js",
    dtsfile: "react.d.ts",
    packagePath: "./packages/survey-react/",
    bundleName: "survey.react",
    entryPoint: "src/entries/react"
};

var config_test_ko = {
    dtsfile: "survey.d.ts",
    src: "./tests/ko/*.ts",
    entryPoint: "./tests/entries/testKo",
    bundleName: "survey.tests.ko",
    htmlFile: "./tests/ko/index_tests_ko.html"
};

var configs = {};
configs["ko"] = config_ko;
configs["react"] = config_react;
var testconfigs = {};
testconfigs["ko"] = config_test_ko;


function buildTemplates(configName, index) {
    var curConfig = configs[configName];
    var curTemplate = curConfig.templates[index];
    return gulp.src(curTemplate.path)
        .pipe(concat(curTemplate.fileName))
        .pipe(html2ts())
        .pipe(insert.transform(function(contents, file) {
            contents = contents.slice(0, -1); //remove last symbol '}'
            contents = contents.replace('module template.window.ko { ', '');
            contents = contents.replace('export var html', 'export var koTemplate = { html : ""}; koTemplate.html');
            return contents.replace('module template.ko { ', '');
        }))
        .pipe(gulp.dest(curTemplate.dest));
}

function buildFromSources(configName) {
    var curConfig = configs[configName];
    var tsResult = gulp.src(curConfig.entryPoint)
        .pipe(webpackStream(getWebpackConfig(curConfig)));
    return tsResult
        .pipe(concat(curConfig.mainJSfile))
        .pipe(insert.prepend(copyright))
        .pipe(gulp.dest(paths.dist))
        .pipe(gulp.dest(paths.jsFolder))
        .pipe(gulp.dest(curConfig.packagePath + "dist/"));
}

function buildTypeDefinition(configName) {
    var curConfig = configs[configName];
    //Build js file
    //Build typescript definition
    var tscResult = gulp.src([
        paths.webroot + "/lib/survey/**/*.d.ts",
        paths.typings
    ].concat(curConfig.src))
        .pipe(ts({
            target: "ES5",
            noExternalResolve: true,
            outDir: "./some/dir/TODO/", // TODO we need any value of outDir for save folders structure for d.ts. BUT WHY?
            declaration: true,
            jsx: "react"
        }));
    return tscResult.dts
        .pipe(concat.header(tdHeader))
        .pipe(gulp.dest(paths.dist_dts))
        .pipe(gulp.dest(curConfig.packagePath + "dist/typings"));
}

function compressMainJS(configName) {
    var curConfig = configs[configName];
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
    var curConfig = testconfigs[configName];
    var tsResult = gulp.src(curConfig.entryPoint)
        .pipe(webpackStream(getWebpackConfig(curConfig)));
    return tsResult
        .pipe(concat(curConfig.mainJSfile))
        .pipe(gulp.dest(paths.testsFolder));
}

function createPackageJson(configName) {
    var curConfig = configs[configName];
    return gulp.src("packagetemplate.json")
        .pipe(jsonTransform(function (data) {
            data.name = curConfig.name;
            data.version = libraryVersion;
            if (curConfig.keywords) {
                for (var i = 0; i < curConfig.keywords.length; i++) {
                    data.keywords.push(curConfig.keywords[i]);
                }
            }
            data.main = './js/' + curConfig.mainJSfile.replace(".js", ".min.js");
            data.typings = './dist/typings/entries/' + curConfig.dtsfile;
            if (curConfig.dependencies) {
                for (var key in curConfig.dependencies) {
                    data.dependencies[key] = curConfig.dependencies[key];
                }
            }
            return data;
        }, "  "))
        .pipe(rename("package.json"))
        .pipe(gulp.dest(curConfig.packagePath));
}

gulp.task("ko_tempates", function () {
    return buildTemplates("ko", 0);
});
gulp.task("ko_windowtempates", function () {
    return buildTemplates("ko", 1);
});
gulp.task("ko_source", function () {
    buildTypeDefinition("ko");
    return buildFromSources("ko");
});
gulp.task("ko_compress", function () {
    compressMainJS("ko");
});
gulp.task("ko_createPackageJson", function () {
    createPackageJson("ko");
});

gulp.task("build_ko", sequence("ko_tempates", "ko_windowtempates", "ko_source", "ko_compress", "ko_createPackageJson"));

gulp.task("buildTests_ko", function () {
    return buildTests("ko");
});

gulp.task("react_source", function () {
    buildTypeDefinition("react");
    return buildFromSources("react");
});
gulp.task("react_compress", function () {
    compressMainJS("react");
});
gulp.task("react_createPackageJson", function () {
    createPackageJson("react");
});
gulp.task("build_react", sequence("react_source", "react_compress", "react_createPackageJson"));

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
gulp.task("makedist", sequence(["sass", "build_ko"], "buildTests_ko", "build_react"));

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