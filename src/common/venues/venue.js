/* @flow */
import { Record } from '../transit';

const Venue = Record({
  key: '',
  title: '',
  description: '',
  latlng: {},
}, 'venue');

export default Venue;
