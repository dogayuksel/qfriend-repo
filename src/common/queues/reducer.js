/* @flow */
import R from 'ramda';
import type { Action, QueuesState, Queue } from '../types';

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
      const queuesQuery = action.payload;
      if (!queuesQuery) {
        return { ...state, queueMap: {}, queuesLoaded: true };
      }
      const appendKey = (queue, key) => ({ ...queue, key });
      const queues: Array<Queue> = R.values(
        R.mapObjIndexed(appendKey, queuesQuery));
      const queueMap = R.groupBy((queue) => queue.venueKey, queues);
      return { ...state, queueMap, queuesLoaded: true };
    }

    default:
      return state;
  }
};

export default reducer;
