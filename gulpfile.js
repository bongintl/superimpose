var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    gulp.src('sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			browsers: ['>1%']
		}))
        .pipe(gulp.dest('.'))
        
})

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('browserify', function(){
	
	return browserify({
	        entries: './js/main.js',
	        debug: true
	    })
	    .bundle()
	    .pipe( source('./bundle.js') )
	    .pipe( buffer() )
	    // .pipe( sourcemaps.init() )
	    .pipe( uglify() )
	    .on( 'error', gutil.log )
	    // .pipe( sourcemaps.write('./') )
	    .pipe( gulp.dest('./') );
	
})

gulp.task('default', ['sass', 'browserify'], function() {
	gulp.watch('./js/**/*.js', ['browserify']);
	gulp.watch('./sass/**/*.scss', ['sass']);
});
