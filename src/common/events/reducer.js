/* @flow weak */
import * as actions from './actions';
import R from 'ramda';
import createEvent from './createEvent';

const initialState = {
  eventList: [],
  eventsLoaded: false,
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.GET_ALL_EVENTS: {
      const { events } = action.payload;
      if (!events) {
        return { ...state }
      }
      const eventList = Object
        .keys(events)
        .map( key => createEvent({ ...events[key], key: key }) );
      return { ...state, eventList, eventsLoaded: true };
    }

    default:
      return state;

  }
};

export default eventsReducer;
