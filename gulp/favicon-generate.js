import gulp from 'gulp';
import realFavicon from 'gulp-real-favicon';

// Settings were generated online on https://realfavicongenerator.net
// Guide: https://www.npmjs.com/package/gulp-real-favicon
gulp.task('favicon-generate', done => {
  realFavicon.generateFavicon({
    masterPicture: './src/common/app/favicons/original/favicon.png',
    dest: './src/common/app/favicons',
    iconsPath: '/assets/favicons',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#333',
        startupImage: {
          masterPicture: './src/common/app/favicons/original/favicon.png',
          backgroundColor: '#333',
        },
        margin: '3%',
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#333',
        onConflict: 'override',
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#333',
        manifest: {
          name: 'qfriend',
          display: 'standalone',
          startUrl: '/tonight',
          orientation: 'portrait',
          onConflict: 'override',
          declared: true,
        },
      },
      safariPinnedTab: {
        pictureAspect: 'black_and_white',
        threshold: '60',
        themeColor: '#333',
      },
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
    },
    markupFile: './gulp/support/favicon/favicon-data.json',
  }, done);
});
