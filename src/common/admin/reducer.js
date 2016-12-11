/* @flow weak */
import * as actions from './actions';

const initialState = {
  isAdmin: false,
  activeEntry: undefined,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.ADMIN_CHECK_DONE: {
      return { ...state, isAdmin: true };
    }

    case actions.SET_ACTIVE_ENTRY: {
      const key = action.payload;
      return { ...state, activeEntry: key };
    }

    case actions.ADD_QUEUE_ENTRY_DONE: {
      return state;
    }

    default:
      return state;

  }
};

export default adminReducer;
