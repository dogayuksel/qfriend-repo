/* @flow weak */

const createQueue = (json) => ({
  loggedAt: '',
  value: '',
  venueKey: '',
  owner: {},
  key: '',
  ...json,
});

export default createQueue;
