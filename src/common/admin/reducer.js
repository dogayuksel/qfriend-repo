import * as actions from './actions';
import { Record } from '../transit';
import { Map } from 'immutable';

const State = Record({
  isAdmin: undefined,
  activeEntry: 'undefined',
}, 'admin');

const adminReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.ON_ADMIN_CHECK: {
      const { adminCheck } = action.payload;
      if (adminCheck && adminCheck.isAdmin === true) {
        return state.set('isAdmin', true);
      }
      return state;
    }

    case actions.SET_ACTIVE_ENTRY: {
      const key = action.payload;
      return state.set('activeEntry', key);
    }

    case actions.ADD_QUEUE_ENTRY_START: {
      return state;
    }

    case actions.ADD_QUEUE_ENTRY_SUCCESS: {
      return state;
    }

    case actions.DELETE_QUEUE_ENTRY_START: {
      return state;
    }

    case actions.DELETE_QUEUE_ENTRY_SUCCESS: {
      return state;
    }

    default:
      return state;

  }
};

export default adminReducer;
