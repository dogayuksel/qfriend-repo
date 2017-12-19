/* @flow */
import R from 'ramda';
import type { Action, VenuesState, Venue } from '../types';

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
        return state;
      }
      const venueList: Array<Venue> = R.filter(
        R.propEq('active', 1))(venues);
      return { ...state, venueList, venuesLoaded: true };
    }

    default:
      return state;
  }
};

export default reducer;
