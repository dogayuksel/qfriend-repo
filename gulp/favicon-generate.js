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
        backgroundColor: '#222',
        margin: '28%',
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#222',
        onConflict: 'override',
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#222',
        manifest: {
          name: 'qfriend',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true,
        },
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#222',
      },
      openGraph: {
	pictureAspect: "backgroundAndMargin",
	backgroundColor: "#222",
	margin: "12%",
	ratio: "1.91:1",
      },
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false,
    },
    markupFile: './gulp/support/favicon/favicon-data.json',
  }, done);
});
