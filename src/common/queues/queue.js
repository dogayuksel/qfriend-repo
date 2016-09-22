/* @flow */
import { Record } from '../transit';

const Queue = Record({
  loggedAt: '',
  value: '',
  venueKey: '',
  owner: {},
  key: '',
}, 'queue');

export default Queue;
