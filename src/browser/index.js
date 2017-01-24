// @flow
/* eslint-disable react/require-extension */
// Bootstrap environment

const onWindowIntl = () => {
  require('babel-polyfill');

  // App locales are defined in src/server/config.js
  const { addLocaleData } = require('react-intl');
  const cs = require('react-intl/locale-data/cs');
  const de = require('react-intl/locale-data/de');
  const en = require('react-intl/locale-data/en');
  const es = require('react-intl/locale-data/es');
  const fr = require('react-intl/locale-data/fr');
  const pt = require('react-intl/locale-data/pt');
  const ro = require('react-intl/locale-data/ro');

  [cs, de, en, es, fr, pt, ro].forEach(locale => addLocaleData(locale));

  require('./main');
};

window.fbAsyncInit = function() {
  console.log('init has fired');
  FB.init({
    appId      : '1000515043403983',
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// github.com/andyearnshaw/Intl.js/#intljs-and-browserifywebpack
if (!window.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/cs.js',
    'intl/locale-data/jsonp/de.js',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/es.js',
    'intl/locale-data/jsonp/fr.js',
    'intl/locale-data/jsonp/pt.js',
    'intl/locale-data/jsonp/ro.js',
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/cs.js');
    require('intl/locale-data/jsonp/de.js');
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/es.js');
    require('intl/locale-data/jsonp/fr.js');
    require('intl/locale-data/jsonp/pt.js');
    require('intl/locale-data/jsonp/ro.js');

    onWindowIntl();
  });
} else {
  onWindowIntl();
}
