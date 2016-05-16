/*global require*/
var gulp = require('gulp'),
    concat = require("gulp-concat"),
    ts = require('gulp-typescript'),
    tsd = require('gulp-tsd'),
    gnf = require('gulp-npm-files'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    qunit = require("gulp-qunit"), 
    serve = require("gulp-serve"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    html2ts = require("gulp-html-to-ts"),
    sequence = require("gulp-sequence"),
    header = require("gulp-header"),
    jsonTransform = require('gulp-json-transform'),
    project = require("./project.json");

var Server = require("karma").Server;

var libraryVersion = "0.9.6";

var paths = {
    webroot: "./" + project.webroot + "/",
    dist: "./dist/",
    dist_dts: "./dist/typings/",
    tsTests: "./tests/*.ts",
    package_ko_dist: "./packages/survey-knockout/dist/",
    typings: "./typings/**/*.d.ts",
    styles: "./src/*.scss",
};
paths.jsFolder = paths.webroot + "js/";
paths.testsFolder = paths.webroot + "tests/";

var copyright = ["/*!", 
 "* surveyjs - Survey JavaScript library v<%= version %>",
 "* (c) Andrew Telnov - http://surveyjs.org/",
 "* License: MIT (http://www.opensource.org/licenses/mit-license.php)",
 "*/", "", ""].join("\n");

var tdHeader = ["// Type definitions for Survey JavaScript library v<%= version %>",
"// Project: http://surveyjs.org/",
"// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>",
"// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped",
"",""].join("\n");

var config_ko_standard = {
    name: "survey-knockout",
    keywords: ["Knockout"],
    dependencies: {"knockout": "^3.4.0"},
    templates: [{ path: "./src/knockout/standard/templates/*.html", fileName: "template.ko.html", dest: "./src/knockout/standard/" },
                { path: "./src/knockout/standard/templates.window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/standard/" }],
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/knockout/*.ts", "./src/knockout/standard/*.ts"],
    mainJSfile: "survey.js",
    dtsfile: "survey.d.ts",
    packagePath: "./packages/survey-knockout/"
}
var config_ko_bootstrap = {
    name: "survey-knockout-bootstrap",
    keywords: ["Knockout", "Bootstrap"],
    dependencies: { "knockout": "^3.4.0", "bootstrap": "^3.3.6" },
    templates: [{ path: "./src/knockout/bootstrap/templates/*.html", fileName: "template.ko.html", dest: "./src/knockout/bootstrap/" },
                { path: "./src/knockout/bootstrap/templates.window/*.html", fileName: "template.window.ko.html", dest: "./src/knockout/bootstrap/" }],
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/knockout/*.ts", "./src/knockout/bootstrap/*.ts"],
    mainJSfile: "survey.bootstrap.js",
    dtsfile: "survey.d.ts",
    packagePath: "./packages/survey-knockout-bootstrap/"
}
var config_react_standard = {
    name: "survey-react",
    keywords: ["react", "react-component"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1" },
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/react/*.tsx", "./src/react/standard/*.tsx"],
    mainJSfile: "survey.react.js",
    dtsfile: "survey-react.d.ts",
    packagePath: "./packages/survey-react/"
}

var config_react_bootstrap = {
    name: "survey-react-bootstrap",
    keywords: ["react", "react-component", "Bootstrap"],
    dependencies: { "react": "^15.0.1", "react-dom": "^15.0.1", "bootstrap": "^3.3.6" },
    src: ["./src/*.ts", "./src/localization/*.ts", "./src/react/*.tsx", "./src/react/bootstrap/*.tsx"],
    mainJSfile : "survey.react.bootstrap.js",
    dtsfile: "survey-react-bootstrap.d.ts",
    packagePath: "./packages/survey-react-bootstrap/"
}

var config_test_ko = {
    dtsfile: "survey.d.ts",
    src: "./tests/ko/*.ts",
    mainJSfile: "survey.tests.ko.js",
    htmlFile: "./tests/ko/index_tests_ko.html"
}

var configs = {};
configs["ko_standard"] = config_ko_standard;
configs["ko_bootstrap"] = config_ko_bootstrap;
configs["react_standard"] = config_react_standard;
configs["react_bootstrap"]= config_react_bootstrap;
var testconfigs = {};
testconfigs["ko"] = config_test_ko;

function buildTemplates(configName) {
    var curConfig = configs[configName];
    //Build templates
    for (var i = 0; i < curConfig.templates.length; i++) {
        var curTemplate = curConfig.templates[i];
        gulp.src(curTemplate.path)
            .pipe(concat(curTemplate.fileName))
            .pipe(html2ts())
            .pipe(gulp.dest(curTemplate.dest));
    }
}
function buildFromSources(configName) {
    var curConfig = configs[configName];
    //Build js file
    var tsResult = gulp.src([
          paths.webroot + "/lib/survey/**/*.d.ts",
          paths.typings
    ].concat(curConfig.src))
       .pipe(sourcemaps.init())
       .pipe(ts({
           target: "ES5",
           noImplicitAny: false,
           declarationFiles: true,
           jsx: "react"
       }));
    return tsResult.js
        .pipe(concat(curConfig.mainJSfile))
        .pipe(header(copyright, { version: libraryVersion }))
        .pipe(sourcemaps.write({ sourceRoot: "src" }))
        //Source map is a part of generated file
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
       .pipe(sourcemaps.init())
       .pipe(ts({
           target: "ES5",
           noExternalResolve: true,
           declaration: true,
           jsx: "react"
       }));
    return tscResult.dts
        .pipe(concat(curConfig.dtsfile))
        .pipe(header(tdHeader, { version: libraryVersion }))
        .pipe(gulp.dest(paths.dist_dts));
}

function compressMainJS(configName) {
    var curConfig = configs[configName];
    //Compress
    gulp.src(paths.dist + curConfig.mainJSfile)
        .pipe(uglify())
            .pipe(rename({
                extname: '.min.js'
            }))
        .pipe(header(copyright, { version: libraryVersion }))
        .pipe(gulp.dest(curConfig.packagePath + "dist/"))
        .pipe(gulp.dest(paths.dist));
}

function buildTests(configName) {
    var curConfig = testconfigs[configName];
    //Build sources
    var tsResult = gulp.src([
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
            data.main = curConfig.mainJSfile.replace(".js", ".min.js");
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

gulp.task("ko_standard_tempates", function () {
    return buildTemplates("ko_standard");
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

gulp.task("build_ko_standard", sequence("ko_standard_tempates", "ko_standard_source", "ko_standard_compress", "ko_standard_createPackageJson"));

gulp.task("ko_bootstrap_tempates", function () {
    return buildTemplates("ko_bootstrap");
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
gulp.task("build_ko_bootstrap", sequence("ko_bootstrap_tempates", "ko_bootstrap_source", "ko_bootstrap_compress", "ko_bootstrap_createPackageJson"));

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

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        latest: true,
        config: 'tsd.json'
    }, callback);
});

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
        .pipe(gulp.dest(paths.package_ko_dist + 'css'))
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