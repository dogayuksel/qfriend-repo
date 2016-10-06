/* @flow */
import { Record } from '../transit';

const Event = Record({
  beginsAt: '',
  name: '',
  description: '',
  photoURL: '',
  residentAdvisorURL: '',
  facebookEventURL: '',
  venueKey: '',
  key: '',
}, 'event');

export default Event;
