/* @flow */
import type { Action, VenuesState, Venue } from '../types';
import R from 'ramda';

const initialState = {
  venueList: [],
  venuesLoaded: false,
};

const reducer = (
  state: VenuesState = initialState,
  action: Action,
): VenuesState => {
  switch (action.type) {
    case 'LIST_VENUES': {
      const { venues } = action.payload;
      if (!venues) {
        return state
      }
      const venueList = Object
        .keys(venues)
        .map( key => {
          const venue: Venue = {
            ...venues[key],
            key: parseInt(key, 10),
          };
          return venue;
        });
      // TODO filter actives
      return { ...state, venueList, venuesLoaded: true };
    }

    default:
      return state;
  }
};

export default reducer;
