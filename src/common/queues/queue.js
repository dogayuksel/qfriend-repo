/* @flow */
import { Record } from '../transit';

const Queue = Record({
  loggedAt: '',
  value: '',
  venueKey: '',
  owner: {},
}, 'queue');

export default Queue;
