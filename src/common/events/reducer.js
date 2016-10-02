/* @flow weak */
import * as actions from './actions';
import Event from './event';
import { Record } from '../transit';
import { Seq } from 'immutable';

const State = Record({
  eventList: null,
  eventsLoaded: false,
}, 'events');

const eventsReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.GET_ALL_EVENTS: {
      const { events } = action.payload;
      const eventList = events && Seq(events)
        .map((event, key) => new Event({ ...event, key }))
        .toList();
      return state
        .set('eventList', eventList)
        .set('eventsLoaded', true);
    }

    default:
      return state;

  }
};

export default eventsReducer;
