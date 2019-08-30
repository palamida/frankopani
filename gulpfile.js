var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var postcssSVG = require('postcss-svg');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

const source='./src/';
const destination='./public/';
const ikone='svg_ikone';

// export BROWSERSLIST_ENV="production"
// BROWSERSLIST_ENV="development" gulp
// BROWSERSLIST_ENV="production" gulp


gulp.task('css', function () {
  return (
    gulp.src(source+'css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      

      require("postcss-import")(
        // {
        //   plugins: [
        //     require("stylelint")({ /* your options */ })
        //   ]
        // }
      ),
      require("stylelint")({ /* your options */ }),
      require('postcss-normalize')(),
      // require('postcss-partial-import')({ /* options */ }),
      // require("postcss-url")(),
      require ('postcss-preset-env')({
        stage: 3,
        features: {
          'nesting-rules': true,
          'custom-media-queries': true,
          'custom-selectors': true,
          'color-mod-function':true,
        }
      }),
      require('postcss-svg')({
        dirs: [source+ikone,'https://github.com/evil-icons/evil-icons/tree/master/assets/icons'],
        svgo: { plugins: [{ cleanupAttrs: true }] },
        ei: { 'dfaults': '[fill]: white' }
      }),
      // require("cssnano")({ autoprefixer: false }),
      // require("postcss-browser-reporter")(),
      require("postcss-reporter")({ clearReportedMessages: true }),
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destination+'css'))
  );
});

gulp.task('images', function(){
  return gulp.src(source+'images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest(destination+'images'))
});

gulp.task('fonts', function() {
  return gulp.src(source+'fonts/**/*')
  .pipe(gulp.dest(destination+'fonts'))
});



gulp.task('default', function() {
    // gulp.watch(["dev/ikone/*"], ['svgSprite'], ['sass'])
    // gulp.watch(["sass/**/*.scss"], ['sass'])
    gulp.watch([source+'images/*.*'], gulp.series('images'));
    gulp.watch([source+'css/*/*.css', source+'css/*.css'], gulp.series('css'));
    // gulp.watch(["dev/js/*.*"], ['js'])
});