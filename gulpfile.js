const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const del = require("del");

// Очистка папки dist перед сборкой
gulp.task("clean", function () {
    return del(["dist"]);
});

// Задача для запуска сервера
gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
    });
});

// Задача для компиляции SCSS в CSS (производство)
gulp.task("styles", function () {
    return gulp
        .src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename({ suffix: ".min" }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Задача для минификации HTML
gulp.task("html", function () {
    return gulp
        .src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream());
});

// Задача для копирования JS
gulp.task("scripts", function () {
    return gulp
        .src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

// Задача для копирования шрифтов
gulp.task("fonts", function () {
    return gulp
        .src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(browserSync.stream());
});

// Задача для копирования иконок
gulp.task("icons", function () {
    return gulp
        .src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
});

// Задача для копирования изображений (отключена из-за проблем с повреждением файлов)
gulp.task("images", function (done) {
    // Копируем изображения вручную для избежания повреждения файлов
    const { exec } = require('child_process');
    exec('mkdir -p dist/img && cp -r src/img/* dist/img/', (error, stdout, stderr) => {
        if (error) {
            console.error('Ошибка копирования изображений:', error);
        } else {
            console.log('Изображения скопированы успешно');
        }
        done();
    });
});

// Задача для наблюдения за изменениями
gulp.task("watch", function () {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
    gulp.watch("src/*.html", gulp.parallel("html"));
    gulp.watch("src/js/**/*.js", gulp.parallel("scripts"));
    gulp.watch("src/fonts/**/*", gulp.parallel("fonts"));
    gulp.watch("src/icons/**/*", gulp.parallel("icons"));
    gulp.watch("src/img/**/*", gulp.parallel("images"));
});

// Задача для сборки проекта
gulp.task(
    "build",
    gulp.series(
        "clean",
        gulp.parallel("styles", "scripts", "fonts", "icons", "html", "images")
    )
);

// Экспортируем задачу build
exports.build = gulp.series("build");

// Основная задача
gulp.task(
    "default",
    gulp.series(
        "clean",
        gulp.parallel(
            "watch",
            "server",
            "styles",
            "scripts",
            "fonts",
            "icons",
            "html",
            "images"
        )
    )
);