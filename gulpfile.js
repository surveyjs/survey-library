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
    getWebpackConfig = require('./webpack.config');

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

var config_ko = {
    name: "survey-knockout",
    keywords: ["Knockout"],
    dependencies: {"knockout": "^3.4.0"},
    templates: [{ path: ["./src/knockout/templates/*.html"], fileName: "template.ko.html", dest: "./src/knockout/" },
        { path: "./src/knockout/templates/window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/" }],
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/cssstandard.ts", "./src/defaultCss/cssbootstrap.ts", "./src/knockout/*.ts"],
    mainJSfile: "survey.js",
    dtsfile: "survey.d.ts",
    packagePath: "./packages/survey-knockout/"
    bundleName: "survey.ko",
    entryPoint: "src/entries/koStandard"
};

const config_react = {
    name: "survey-react",
    keywords: ["react", "react-component"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1" },
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/defaultCss/*.ts", "./src/react/*.tsx"],
    mainJSfile: "survey.react.js",
    dtsfile: "survey-react.d.ts",
    packagePath: "./packages/survey-react/",
    bundleName: "survey.react",
    entryPoint: "src/entries/reactStandard"
};

const config_test_ko = {
    dtsfile: "survey.d.ts",
    src: "./tests/ko/*.ts",
    entryPoint: "./tests/entries/testKo",
    bundleName: "survey.tests.ko",
    htmlFile: "./tests/ko/index_tests_ko.html"
};

const configs = {};
configs["ko"] = config_ko;
configs["react"] = config_react;
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
    const tsResult = gulp.src(curConfig.entryPoint)
        .pipe(webpackStream(getWebpackConfig(curConfig)));
    return tsResult
        .pipe(concat(curConfig.mainJSfile))
        .pipe(insert.prepend(copyright))
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
    const tsResult = gulp.src(curConfig.entryPoint)
        .pipe(webpackStream(getWebpackConfig(curConfig)));
    return tsResult
        .pipe(concat(curConfig.mainJSfile))
        .pipe(sourcemaps.write({ sourceRoot: "tests" }))
        //Source map is a part of generated file
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
    //buildTypeDefinition("react");
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