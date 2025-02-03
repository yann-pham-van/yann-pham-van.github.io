const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");

// 📌 Dossiers source et destination
const paths = {
    styles: {
        src: "scss/**/*.scss",
        dest: "css/"
    },
    scripts: {
        src: "js/**/*.js",
        dest: "dist/js/"
    },
    images: {
        src: "images/**/*",
        dest: "dist/images/"
    }
};

// 🎨 2. Compilation & Minification du CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.styles.dest));
}

// ⚡ 3. Minification & Concaténation du JS
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

// 🖼️ 4. Optimisation des images
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

// 🔄 5. Nettoyage des fichiers générés
function cleanDist() {
    return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
}

// 👀 6. Watch : Recompile automatiquement lors des modifications
function watchFiles() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
}

// 📢 Commandes Gulp
exports.clean = cleanDist;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watchFiles;

// 💥 Tâche par défaut (Build complet)
exports.default = gulp.series(cleanDist, gulp.parallel(styles, scripts, images), watchFiles);
