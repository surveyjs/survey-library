var platforms = ["angular", "jquery", "knockout", "react"];

var gulp = require('gulp'),
    merge2 = require('merge2'),
    sass = require('gulp-sass'),
    concat = require("gulp-concat-util"),
    html2ts = require("gulp-html-to-ts"),
    insert = require('gulp-insert');

var project = require("./project.json");
var paths = {
    webroot: "./" + project.webroot + "/",
    packages: "./packages/survey-platform/",
    styles: "./src/*.scss"
};

gulp.task('build_prod', function () {
    return merge2(
        compileSass(),
        buildKnockoutTemplates(),
        webpack('dev'),
        webpack('prod'),
        buildTests(),
        createPackageJson()
    );
});

gulp.task('build_dev', function () {
    return merge2(
        compileSass(),
        buildKnockoutTemplates(),
        webpack('dev')
    );
});

function getPackagePath(platform) {
    return paths.packages.replace("platform", platform);
}

function compileSass() {
    var stream = gulp.src(paths.styles)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat("survey.css"))
        .pipe(gulp.dest(paths.webroot + 'css'));

    platforms.forEach(function (platform) {
        stream = stream
            .pipe(gulp.dest(getPackagePath(platform) + 'dist/css'))
            .pipe(gulp.dest(getPackagePath(platform) + 'css'));
    });

    return stream;
}

function buildKnockoutTemplates() {
    var stream;
    var templates = [
        { path: ["./src/knockout/templates/*.html", "./src/plugins/knockout/templates/*.html"], fileName: "template.ko.html" },
        { path: "./src/knockout/templates/window/*.html", fileName: "template.window.ko.html" }
    ];

    templates.forEach(function (template) {
        stream = gulp.src(template.path)
            .pipe(concat(template.fileName))
            .pipe(html2ts())
            .pipe(insert.transform(function(contents, file) {
                contents = contents.slice(0, -1); //remove last symbol '}'
                contents = contents.replace('module template.window.ko { ', '');
                contents = contents.replace('export var html', 'export var koTemplate = { html : ""}; koTemplate.html');
                return contents.replace('module template.ko { ', '');
            }))
            .pipe(gulp.dest("./src/knockout/"));
    });

    return stream;
}