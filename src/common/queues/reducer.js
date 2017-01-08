/* @flow */
import R from 'ramda';
import type { Action, QueuesState, Queue } from '../types';
import moment from 'moment';

const initialState = {
  queueMap: {},
  queuesLoaded: false,
};

const reducer = (
  state: QueuesState = initialState,
  action: Action,
): QueuesState => {
  switch (action.type) {
    case 'CHECK_ALL_QUEUES': {
      const queueList = action.payload;
      if (!queueList) {
        return { ...state, queueMap: {}, queuesLoaded: true };
      }
      const queues = Object
        .keys(queueList)
        .map( key => {
          const queue: Queue = {
            ...queueList[key],
            key,
          };
          return queue;
        }
        );
      let queueMap = {};
      R.map((value) => {
        if (!queueMap[`${value.venueKey}`]) {
          queueMap[`${value.venueKey}`] = [value];
        } else {
          const list = queueMap[`${value.venueKey}`];
          list.push(value);
          queueMap[`${value.venueKey}`] = list;
        }
      }, queues);
      return { ...state, queueMap, queuesLoaded: true };
    }

    default:
      return state;
  }
};

export default reducer;
