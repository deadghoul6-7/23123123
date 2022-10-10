const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const browserSync = require('browser-sync').create();

//создаем такс (задачу) для стилей
const styles = () => {
    return src('src/style/**/*.css')
        .pipe(concat('style.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
} 
//создаем таск (задачу) для html
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () =>{
    return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
        mode:{
            stack:{
                sprite:'../sprite.svg'
            }
        }
    }))
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream());
}

const images = () =>{
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.jpeg',
        'src/images/**/*.png',
        'src/images/*.svg'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}


const watchFile = () => {
    browserSync.init({// инициализация локального сервера 
        server:{
            baseDir:'dist'// из какой директории брать индех 
        }
    });
}

watch('src/**/*.html',htmlMinify);
watch('src/style/**/*.css',styles);
watch('src/images/svg/**/*.svg',svgSprites);
watch([
    'src/images/**/*.jpg',
    'src/images/**/*.jpeg',
    'src/images/**/*.png',
    'src/images/*.svg'
],images)

//экпорт тасков (задач)
// exports.styles = styles;
// exports.html = htmlMinify;

exports.default = series(styles, htmlMinify,svgSprites,images, watchFile);