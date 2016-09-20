/* @flow weak */
import * as actions from './actions';
import Queue from './queue';
import { Record } from '../transit';
import { Seq, Map } from 'immutable';

const State = Record({
  queue: Map(),
}, 'queues');

const queuesReducer = (state = new State(), action) => {
  switch (action.type) {

    case actions.CHECK_QUEUES: {
      const queues = action.payload;
      const queueArray = Seq(queues)
        .filter(queue => {
          const thresh = new Date().getTime() - queue.loggedAt - 21600000;
          if (thresh > 0) return false;
          return true;
        })
        .map(queue => new Queue(queue)).toList();
      console.log('queue array', queueArray);
      if (queueArray.size === 0) { return state; }
      const venueKey = queueArray.first().venueKey;
      return state.mergeDeep({ queue: { [`${venueKey}`]: queueArray } });
    }

    default:
      return state;
  }
};

export default queuesReducer;
