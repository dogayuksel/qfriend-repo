/* @flow */
import { Record } from '../transit';

const Event = Record({
  beginsAt: '',
  name: '',
  description: '',
  photoURL: '',
  residentAdvisorURL: '',
  facebookEventURL: '',
  isFeatured: '',
  venueKey: '',
  key: '',
}, 'event');

export default Event;
