/*global require*/
var gulp = require('gulp'),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    project = require("./project.json");

var Server = require("karma").Server;

var paths = {
    webroot: "./" + project.webroot + "/",
    ts: ["./sources/*.ts"],
    typings: "./typings/**/*.d.ts",
    tsTests: "./tests/*.ts",
    tsTests_ko: "./tests/ko/*.ts",
    styles: "./sources/*.scss",
    templates_ko: "./sources/templates/ko/*.html"
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

(function () {
    "use strict";
    gulp.task("clean:js", function (cb) {
        rimraf(paths.js, cb);
    });

    gulp.task("clean:css", function (cb) {
        rimraf(paths.js, cb);
    });

    gulp.task("clean", ["clean:js", "clean:css"]);
})("Clean");

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
            .pipe(concat('dx.scripts.js'))
            .pipe(sourcemaps.write({ sourceRoot: "sources" }))
            //Source map is a part of generated file
            .pipe(gulp.dest(paths.jsFolder));
    });

    gulp.task("typescript:tests", function () {
        var tsResult = gulp.src([
              paths.webroot + "/lib/dxsurvey/**/*.d.ts",
              paths.typings,
              //"./sources/model/*.ts",
              paths.tsTests])
           .pipe(sourcemaps.init())
           .pipe(ts({
               target: "ES5",
               noImplicitAny: false
           }));

        return tsResult.js
            .pipe(concat('tests.js'))
            .pipe(sourcemaps.write({ sourceRoot: "sources" }))
            //Source map is a part of generated file
            .pipe(gulp.dest(paths.testsFolder));
    });

    gulp.task("typescript:tests_ko", function () {
        var tsResult = gulp.src([
              paths.webroot + "/lib/dxsurvey/**/*.d.ts",
              paths.typings,
              //"./sources/model/*.ts",
              paths.tsTests_ko])
           .pipe(sourcemaps.init())
           .pipe(ts({
               target: "ES5",
               noImplicitAny: false
           }));

        return tsResult.js
            .pipe(concat('tests_ko.js'))
            .pipe(sourcemaps.write({ sourceRoot: "sources" }))
            //Source map is a part of generated file
            .pipe(gulp.dest(paths.testsFolder));
    });

    gulp.task("typescript", ["typescript:sources", "typescript:tests", "typescript:tests_ko"]);
})("TypeScript compilation");

(function () {
    "use strict";
    gulp.task('add_ts_watch:sources', function () {
        gulp.watch([paths.ts], ["typescript:sources"]);
    });
    gulp.task('add_ts_watch:tests', function () {
        gulp.watch([paths.tsTests], ["typescript:tests"]);
    });

    gulp.task("add_ts_watch", ["add_ts_watch:app", "add_ts_watch:sources", "add_ts_watch:tests"]);


    gulp.task('add_sass_watch', function () {
        gulp.watch([paths.styles], ["sass"]);
    });

})("Add watchers");


gulp.task('sass', function () {
    "use strict";    
    gulp.src(paths.styles)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(concat("components.css"))
      .pipe(gulp.dest(paths.webroot + 'css'));
});

gulp.task('templates', function () {
    "use strict";    
    gulp.src(paths.templates_ko)
      .pipe(concat("knockout.html"))
      .pipe(gulp.dest(paths.webroot + 'templates'));
});
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
