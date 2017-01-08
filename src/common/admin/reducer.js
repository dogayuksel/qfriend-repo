/* @flow */
import type { Action, AdminState } from '../types';

const initialState = {
  isAdmin: false,
  activeEntry: null,
};

const reducer = (
  state: AdminState = initialState,
  action: Action,
): AdminState => {
  switch (action.type) {
    case 'ADMIN_CHECK_DONE': {
      return { ...state, isAdmin: true };
    }

    case 'SET_ACTIVE_ENTRY': {
      const { venueKey } = action.payload;
      return { ...state, activeEntry: venueKey };
    }

    default:
      return state;

  }
};

export default reducer;
