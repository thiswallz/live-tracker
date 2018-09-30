"use strict";

var autoprefixer = require("gulp-autoprefixer");
var del = require("del");
var gulp = require("gulp");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");

gulp.task("clean", () => del(["src/index.min.js"]));

gulp.task("scripts", function() {
  return gulp
    .src("./src/index.js")
    .pipe(uglify())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("./src/"));
});

gulp.task("default", ["clean"], function() {
  runSequence("scripts");
});
