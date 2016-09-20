/* @flow */
export const LIST_VENUES = 'LIST_VENUES';

export const listVenues = (snap: Object) => {
  const venues = snap.val();
  return {
    type: LIST_VENUES,
    payload: { venues },
  };
};
