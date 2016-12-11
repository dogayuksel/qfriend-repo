/* @flow weak */

const createEvent = (json) => ({
  beginsAt: '',
  name: '',
  description: '',
  photoURL: '',
  residentAdvisorURL: '',
  facebookEventURL: '',
  isFeatured: '',
  venueKey: '',
  key: '',
  ...json,
});

export default createEvent;
