/* @flow weak */
import * as actions from './actions';
import R from 'ramda';
import createVenue from './createVenue';

const initialState = {
  venueList: [],
  venuesLoaded: false,
};

const venuesReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.LIST_VENUES: {
      const { venues } = action.payload;
      if (!venues) {
        return state
      }
      const venueList = Object
        .keys(venues)
        .map( key => createVenue({
          ...venues[key],
          key: parseInt(key, 10),
        }));
      // TODO filter actives
      return { ...state, venueList, venuesLoaded: true };
    }

    default:
      return state;

  }
};

export default venuesReducer;
