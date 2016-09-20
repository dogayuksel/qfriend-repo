/* @flow weak */
import * as actions from './actions';
import Venue from './venue';
import { Record } from '../transit';
import { Seq } from 'immutable';

const State = Record({
  venues: null,
  venuesLoaded: false,
}, 'venues');

const venuesReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.LIST_VENUES: {
      const { venues } = action.payload;
      const venueList = venues && Seq(venues).map(venue => new Venue(venue)).toList();
      return state
        .set('venues', venueList)
        .set('venuesLoaded', true);
    }

    default:
      return state;

  }
};

export default venuesReducer;
