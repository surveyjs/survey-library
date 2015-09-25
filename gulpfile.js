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
    templates_ko: "./src/templates/ko/*.html"
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
                  paths.webroot + "/lib/dxsurvey/**/*.d.ts",
                  paths.typings
            ].concat(paths.ts))
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false
                }));

            return tsResult.js
                .pipe(concat('dx.survey.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.dist))
                .pipe(gulp.dest(paths.jsFolder));
        });

        gulp.task("typescript:tests", function () {
            var tsResult = gulp.src([
                  paths.webroot + "/lib/dxsurvey/**/*.d.ts",
                  paths.typings,
                  //"./src/model/*.ts",
                  paths.tsTests])
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false
               }));

            return tsResult.js
                .pipe(concat('dx.survey.tests.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.testsFolder));
        });

        gulp.task("typescript:tests_ko", function () {
            var tsResult = gulp.src([
                  paths.webroot + "/lib/dxsurvey/**/*.d.ts",
                  paths.typings,
                  //"./src/model/*.ts",
                  paths.tsTests_ko])
               .pipe(sourcemaps.init())
               .pipe(ts({
                   target: "ES5",
                   noImplicitAny: false
               }));

            return tsResult.js
                .pipe(concat('dx.survey.tests_ko.js'))
                .pipe(sourcemaps.write({ sourceRoot: "src" }))
                //Source map is a part of generated file
                .pipe(gulp.dest(paths.testsFolder));
        });
        gulp.task('test:copy-index-html', function () {
            gulp.src('./tests/index.html')
            // Perform minification tasks, etc here
            .pipe(gulp.dest(paths.testsFolder));
        });

        gulp.task("typescript", ["typescript:sources", "typescript:tests", "typescript:tests_ko", "test:copy-index-html"]);
    })("TypeScript compilation");

    gulp.task('compress', function () {
        "use strict";
        return gulp.src(paths.dist + 'dx.survey.js')
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
          .pipe(concat("dx.survey.css"))
          .pipe(gulp.dest(paths.webroot + 'css'))
          .pipe(gulp.dest(paths.dist + 'css'));
    });

    gulp.task('templates', function () {
        "use strict";    
        gulp.src(paths.templates_ko)
          .pipe(concat("dx.survey.ko.html"))
          .pipe(gulp.dest(paths.webroot + 'templates'))
        .pipe(gulp.dest(paths.dist + 'templates'));
    });

    gulp.task("makedist", ["typescript", "templates", "sass"]);
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
