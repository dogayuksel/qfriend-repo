/* @flow weak */
import Raven from 'raven-js';
import ReactGA from 'react-ga';
import { firebaseActions } from './lib/redux-firebase';

// bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events
const register = unhandledRejection => unhandledRejection(event => {
  event.preventDefault();
  // http://bluebirdjs.com/docs/api/error-management-configuration.html
  const { reason: error } = event.detail;
  if (process.env.NODE_ENV === 'production') {
    Raven.captureException(error);
    // We can use also Raven.lastEventId() and Raven.showReportDialog().
    // Check docs.getsentry.com/hosted/clients/javascript/usage
  } else {
    /* eslint-disable no-console */
    console.warn('Unhandled promise rejection. Fix it or it will be reported.');
    console.warn(error);
    /* eslint-enable no-console */
  }
});

const setRavenUserContext = user => {
  if (!user) {
    Raven.setUserContext();
    return;
  }
  Raven.setUserContext({
    email: user.email,
    id: user.id,
  });
};

const reportingMiddleware = () => next => action => {
  if (action.type === firebaseActions.FIREBASE_ON_AUTH) {
    setRavenUserContext(action.payload.user);
  }
  if (process.env.NODE_ENV === 'production') {
    if (action.type === "APP_SET_LOCATION") {
      ReactGA.set({ page: action.payload.location.pathname });
      ReactGA.pageview(action.payload.location.pathname);
    }
    if (action.type === "FIREBASE_SIGN_IN_START") {
      ReactGA.event({
        category: 'User',
        action: 'Tried Signing in',
      });
    }
  }
  // TODO: Use Raven.setExtraContext for last 10 actions and limited app state.
  return next(action);
};

const configureReporting = (options) => {
  const { appVersion,
          sentryUrl,
          unhandledRejection,
          googleAnalyticsId } = options;
  ReactGA.initialize(googleAnalyticsId);
  Raven.config(sentryUrl, {
    // gist.github.com/impressiver/5092952
    ignoreErrors: [
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'http://tt.epicplay.com',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',
      'http://loading.retry.widdit.com/',
      'atomicFindClose',
      'fb_xd_fragment',
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      'conduitPage',
      // Firebase
      'Access is denied.',
      'An internal error has occurred.',
      'PERMISSION_DENIED: Permission denied',
      'A network error (such as timeout, interrupted connection or unreachable host) has occurred',
    ],
    ignoreUrls: [
      // Facebook flakiness
      /graph\.facebook\.com/i,
      // Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i,
      // Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i,
      /static\.woopra\.com\/js\/woopra\.js/i,
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Other plugins
      /127\.0\.0\.1:4001\/isrunning/i,  // Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i,
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    ],
    release: appVersion,
    // TODO: serverName: device.uuid
    // TODO: Add list of common ignore rules from
    // docs.getsentry.com/hosted/clients/javascript/tips/#decluttering-sentry
  }).install();
  register(unhandledRejection);
  return reportingMiddleware;
};

export default configureReporting;
