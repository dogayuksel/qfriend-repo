/* @flow weak */
import * as actions from './actions';
import R from 'ramda';
import createQueue from './createQueue';
import moment from 'moment';

const initialState = {
  queueMap: {},
};

const queuesReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.CHECK_ALL_QUEUES: {
      const queueList = action.payload;
      if (!queueList) {
        return { ...state, queueMap: {} };
      }
      const queues = Object
        .keys(queueList)
        .map( key => createQueue({
          ...queueList[key],
          key,
        }));
      let queueMap = {};
      R.map((value) => {
        if (!queueMap[`${value.venueKey}`]) {
          queueMap[`${value.venueKey}`] = [value];
        } else {
          const list = queueMap[`${value.venueKey}`];
          list.push(createQueue(value));
          queueMap[`${value.venueKey}`] = list;
        }
      }, queues);
      return { ...state, queueMap };
    }

    case actions.DELETE_QUEUE_ENTRY_DONE: {
      return state;
    }

    default:
      return state;
  }
};

export default queuesReducer;
