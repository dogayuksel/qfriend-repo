/* @flow weak */
import * as actions from './actions';
import Venue from './venue';
import { Record } from '../transit';
import { Seq, List } from 'immutable';

const State = Record({
  venueList: List(),
  venuesLoaded: false,
}, 'venues');

const venuesReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.LIST_VENUES: {
      const { venues } = action.payload;
      const venueList = venues && Seq(venues)
        .filter(venue => venue.active === 1)
        .map(venue => new Venue(venue))
        .toList();
      return state
        .set('venueList', venueList)
        .set('venuesLoaded', true);
    }

    default:
      return state;

  }
};

export default venuesReducer;
