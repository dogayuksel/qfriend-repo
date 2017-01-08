/* @flow */
import type { Action } from '../types';

export const listVenues = (snap: Object): Action => {
  const venues = snap.val();
  return {
    type: 'LIST_VENUES',
    payload: { venues },
  };
};
