/* @flow */
import { Record } from '../transit';

const Venue = Record({
  key: '',
  title: '',
  description: '',
  facebookURL: '',
  address: '',
  latlng: {},
}, 'venue');

export default Venue;
