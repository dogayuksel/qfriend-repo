/* @flow */
import type { Action, EventsState, Event } from '../types';
/* import R from 'ramda';*/

const initialState = {
  eventList: [],
  eventsLoaded: false,
  eventBeingSaved: false,
};

const reducer = (
  state: EventsState = initialState,
  action: Action,
): EventsState => {
  switch (action.type) {

    case 'SAVE_EVENT': {
      return { ...state, eventBeingSaved: true };
    }

    case 'SAVE_EVENT_DONE':
    case 'SAVE_EVENT_FAILED': {
      return { ...state, eventBeingSaved: false };
    }

    case 'GET_ALL_EVENTS': {
      const { events } = action.payload;
      if (!events) {
        return { ...state };
      }
      const eventList = Object
        .keys(events)
        .map(key => {
          const event: Event = {
            ...events[key],
            key,
          };
          return event;
        });
      return { ...state, eventList, eventsLoaded: true };
    }

    case 'GET_ONE_EVENT': {
      const { event, eventKey } = action.payload;
      if (!event) {
        return { ...state };
      }
      const { eventList } = state;
      if (eventList.find((event) => event.key === eventKey)) {
        return { ...state, eventsLoaded: true };
      }
      const newEvent: Event = {
        ...event,
        key: eventKey,
      };
      eventList.push(newEvent);
      return { ...state, eventList, eventsLoaded: true };
    }

    default:
      return state;

  }
};

export default reducer;
