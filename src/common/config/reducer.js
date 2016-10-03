/* @flow weak */
import { Record } from '../transit';

const State = Record({
  appName: '',
  appVersion: '',
  firebase: '',
  sentryUrl: '',
  googleAnalyticsId: '',
}, 'config');

const configReducer = (state = new State()) => state;

export default configReducer;
