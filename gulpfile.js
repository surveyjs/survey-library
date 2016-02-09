/// <binding ProjectOpened='copylibs' />
/*global require*/
var gulp = require('gulp'),
    concat = require("gulp-concat"),
    ts = require('gulp-typescript'),
    tsd = require('gulp-tsd'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    qunit = require("gulp-qunit"), 
    serve = require("gulp-serve"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    html2ts = require("gulp-html-to-ts"),
    project = require("./project.json"),
    plugins = require("gulp-load-plugins")({
        pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
        replaceString: /\bgulp[\-.]/});

var Server = require("karma").Server;

var paths = {
    webroot: "./" + project.webroot + "/",
    dist: "./dist/",
    ts: ["./src/*.ts"],
    typings: "./typings/**/*.d.ts",
    tsTests: "./tests/*.ts",
    tsTests_ko: "./tests/ko/*.ts",
    styles: "./src/*.scss",
    templates_ko: "./src/templates/ko/*.html",
    templates_window_ko: "./src/templates/window.ko/*.html"
};

paths.jsFolder = paths.webroot + "js/";
paths.testsFolder = paths.webroot + "tests/";
paths.js = paths.jsFolder + "**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";

gulp.task('default', function () {
    "use strict";
    // place code for your default task here
});

gulp.task('copylibs', function () {
    var jsFiles = ['src/js/*'];
    gulp.src(plugins.mainBowerFiles({includeDev: "true"}).concat(jsFiles))
        .pipe(gulp.dest(paths.jsFolder));
});

gulp.task('tsd', function (callback) {
    tsd({
        command: 'reinstall',
        config: 'tsd.json'
    }, callback);
});

(function () {
    (function () {
        "use strict";
        gulp.task("typescript:sources", function () {
            var tsResult = gulp.src([
                  paths.webroot + "/lib/survey/**/*.d.ts",
                  paths.typings
            ].concat(paths.ts))
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false,
                   declarationFiles: true
                }));

            return tsResult.js
                .pipe(concat('survey.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.dist))
                .pipe(gulp.dest(paths.jsFolder));
        });
        gulp.task("typescript:sources:definition", function () {
            var tscResult = gulp.src([
                  paths.webroot + "/lib/survey/**/*.d.ts",
                  paths.typings
            ].concat(paths.ts))
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noExternalResolve: true,
                   declaration: true
               }));

            return tscResult.dts
                .pipe(concat('survey.d.ts'))
                .pipe(gulp.dest(paths.dist));
        });

        gulp.task("typescript:tests", function () {
            var tsResult = gulp.src([
                  paths.webroot + "/lib/survey/**/*.d.ts",
                  paths.typings,
                  //"./src/model/*.ts",
                  paths.tsTests])
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false
               }));

            return tsResult.js
                .pipe(concat('survey.tests.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.testsFolder));
        });

        gulp.task("typescript:tests_ko", function () {
            var tsResult = gulp.src([
                  paths.webroot + "/lib/survey/**/*.d.ts",
                  paths.typings,
                  //"./src/model/*.ts",
                  paths.tsTests_ko])
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false
               }));

            return tsResult.js
                .pipe(concat('survey.tests_ko.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.testsFolder));
        });
        gulp.task('test:copy-index-html', function () {
            gulp.src('./tests/index.html')
            // Perform minification tasks, etc here
            .pipe(gulp.dest(paths.testsFolder));
        });

        gulp.task("typescript", ["typescript:sources", "typescript:sources:definition", "typescript:tests", "typescript:tests_ko", "test:copy-index-html"]);
    })("TypeScript compilation");

    gulp.task('compress', function () {
        "use strict";
        return gulp.src(paths.dist + 'survey.js')
            .pipe(uglify())
             .pipe(rename({
                 extname: '.min.js'
             }))
            .pipe(gulp.dest(paths.dist));
    });

    gulp.task('sass', function () {
        "use strict";    
        gulp.src(paths.styles)
          .pipe(sass.sync().on('error', sass.logError))
          .pipe(concat("survey.css"))
          .pipe(gulp.dest(paths.webroot + 'css'))
          .pipe(gulp.dest(paths.dist + 'css'));
    });

    gulp.task('templates', function () {
        "use strict";    
        gulp.src(paths.templates_ko)
          .pipe(concat("template.ko.html"))
          .pipe(html2ts())
          .pipe(gulp.dest("./src/"));
        gulp.src(paths.templates_window_ko)
          .pipe(concat("template.window.ko.html"))
          .pipe(html2ts())
          .pipe(gulp.dest("./src/"));
    });

    gulp.task("makedist", ["templates", "typescript", "sass", "compress"]);
})("TypeScript compilation");

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
