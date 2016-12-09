"use strict";

var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2');

gulp.task("lint", function() {
    var config = { formatter: "verbose", emitError: (process.env.CI) ? true : false };

    return gulp.src([
        "src/**/**.ts"
    ])
        .pipe(tslint(config))
        .pipe(tslint.report());
});

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build", function() {
    var tsResults = gulp.src([
        "src/**/**.ts",
        "typings/main.d.ts/"
    ])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", function(err) {
            process.exit(1);
        });

    return merge([
        tsResults.dts.pipe(gulp.dest('src/')),
        tsResults.js.pipe(sourcemaps.write('src/')).pipe(gulp.dest('src/'))
    ]);
});

gulp.task("watch", ["default"], function() {
    gulp.watch(["src/**/*.ts"], ["default"]);
});

gulp.task("default", function(cb) {
    runSequence("lint", "build", cb);
});