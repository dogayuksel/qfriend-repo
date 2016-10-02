/* @flow */
import { Record } from '../transit';

const Event = Record({
  beginsAt: '',
  name: '',
  description: '',
  photoURL: '',
  venueKey: '',
  key: '',
}, 'event');

export default Event;
