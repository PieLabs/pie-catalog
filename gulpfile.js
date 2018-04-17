const gulp = require("gulp"),
  mocha = require("gulp-mocha"),
  ts = require("gulp-typescript"),
  tsProject = ts.createProject("tsconfig.json"),
  fsExtra = require("fs-extra"),
  runSequence = require("run-sequence"),
  path = require("path"),
  webpack = require("webpack"),
  exec = require("child_process").exec;

let glue = suffix => gulp.src(`src/**/*.${suffix}`).pipe(gulp.dest("lib"));

let watch = (suffix, tasks) => {
  tasks = tasks ? tasks : [suffix];
  return gulp.watch(`src/**/*.${suffix}`, tasks);
};

gulp.task("pug", () => glue("pug"));

gulp.task("ts", () => {
  let tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("lib"));
});

gulp.task("watch-ts", () => watch("ts"));
gulp.task("watch-pug", () => watch("pug"));

gulp.task("unit", ["build"], () => {
  return gulp
    .src("test/unit/**/*.js", { read: false })
    .pipe(mocha({ require: ["babel-register"] }));
});

gulp.task("it", ["build"], () => {
  return gulp
    .src("test/it/**/*-test.js", { read: false })
    .pipe(mocha({ require: ["babel-register"] }));
});

gulp.task("clean", done => {
  fsExtra.remove("lib", done);
});

gulp.task("client", done => {
  let cfg = require("./src/client/webpack.config");
  cfg.output.path = path.resolve("./lib/client/public");
  webpack(cfg, done);
});

gulp.task("install-client-dependencies", done => {
  exec("cd src/client && npm install && cd ..", done);
});

gulp.task("polyfills", () => {
  gulp
    .src(["src/client/node_modules/@webcomponents/**/*"])
    .pipe(gulp.dest("lib/client/node_modules/@webcomponents"));
});

gulp.task("build", done =>
  runSequence("clean", ["pug", "ts", "client", "polyfills"], done)
);

gulp.task("dev", ["build", "watch-pug", "watch-ts"]);

gulp.task("test", ["unit"]);

gulp.task("postinstall", done =>
  runSequence("install-client-dependencies", done)
);
