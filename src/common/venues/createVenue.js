/* @flow weak */

const createVenue = (json) => ({
  key: '',
  title: '',
  description: '',
  facebookURL: '',
  address: '',
  latlng: {},
  ...json,
});

export default createVenue;
