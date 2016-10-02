/* @flow weak */
import * as actions from './actions';
import { Record } from '../transit';
import { Map } from 'immutable';

const State = Record({
  isAdmin: undefined,
  activeEntry: 'undefined',
}, 'admin');

const adminReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.ADMIN_CHECK_SUCCESS: {
      const adminCheck = action.payload.val();
      if (adminCheck && adminCheck.isAdmin) {
        return state.set('isAdmin', true)
      }
      return state;
    }

    case actions.SET_ACTIVE_ENTRY: {
      const key = action.payload;
      return state.set('activeEntry', key);
    }

    default:
      return state;

  }
};

export default adminReducer;
