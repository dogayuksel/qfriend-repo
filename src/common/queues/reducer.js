/* @flow weak */
import * as actions from './actions';
import Queue from './queue';
import { Record } from '../transit';
import { List, Seq, Map } from 'immutable';

const State = Record({
  queueMap: Map(),
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
        .map((value, key) => new Queue({ key, ...value })).toList();
      if (queueArray.size === 0) {
        return state.set('queueMap', Map());
      }
      const venueKey = queueArray.first().venueKey;
      let queueMap = state.queueMap.remove(`${venueKey}`);
      queueMap = queueMap.set(`${venueKey}`, queueArray);
      return state.set('queueMap', queueMap);
    }

    case actions.CHECK_ALL_QUEUES: {
      const queues = Seq(action.payload);
      let queueMap = Map();
      queues.forEach((value, key) => {
        if (!queueMap.get(`${value.venueKey}`)) {
          queueMap = queueMap.set(`${value.venueKey}`,
                                  List([new Queue({ key, ...value })]));
        } else {
          const list = queueMap.get(`${value.venueKey}`);
          queueMap = queueMap.set(`${value.venueKey}`,
                                  list.push(new Queue({ key, ...value })));
        }
      });
      return state.mergeDeep({ queueMap });
    }

    case actions.DELETE_QUEUE_ENTRY_SUCCESS: {
      return state;
    }

    default:
      return state;
  }
};

export default queuesReducer;
