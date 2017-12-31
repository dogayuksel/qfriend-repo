/* @flow */
import type { Action, GuidesState } from '../types';
/* import R from 'ramda';*/

const initialState = {
  guideDate: null,
  guideVenue: null,
  guideEvent: null,
};

const reducer = (
  state: GuidesState = initialState,
  action: Action,
): GuidesState => {
  switch (action.type) {

    case 'SET_GUIDE_VENUE': {
      const { venueKey } = action.payload;
      return { ...state, guideVenue: venueKey };
    }

    case 'SET_GUIDE_EVENT': {
      const { eventKey } = action.payload;
      return { ...state, guideEvent: eventKey };
    }

    case 'SET_GUIDE_DATE': {
      const { guideDate } = action.payload;
      return { ...state, guideDate };
    }

    default:
      return state;

  }
};

export default reducer;
