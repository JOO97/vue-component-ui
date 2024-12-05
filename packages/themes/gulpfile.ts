/**
 * 1. Compile sass->scss
 * 2. Copy font
 * 3. Copy full style
 */
import { resolve } from 'node:path'

import { dest, series, src } from 'gulp'

import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'

const compile = () => {
  const sass = gulpSass(dartSass)
  return src(resolve(__dirname, './src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(dest('./dist'))
}

const copyFont = function () {
  return src(resolve(__dirname, './src/fonts/**')).pipe(dest('./dist/fonts'))
}
// const copyFullStyle = function () {
//   return src(resolve(__dirname, './dist/**')).pipe(
//     dest(resolve(__dirname, '../../dist/themes'))
//   )
// }

export default series(compile, copyFont)
