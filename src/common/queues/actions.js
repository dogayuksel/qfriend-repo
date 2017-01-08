/* @flow */
import { Observable } from 'rxjs/Observable';
import type { Action, Deps } from '../types';

export const checkAllQueues = (snap: Object): Action => {
  const queues = snap.val();
  return {
    type: 'CHECK_ALL_QUEUES',
    payload: queues,
  };
};

export const deleteQueueEntryDone = (): Action => {
  return {
    type: 'DELETE_QUEUE_ENTRY_DONE',
  };
};

export const deleteQueueEntry = (key: string): Action => {
    return {
      type: 'DELETE_QUEUE_ENTRY',
      payload: { key },
    };
};

const deleteQueueEntryEpic = (action$: any, {firebase}: Deps) =>
  action$.filter((action: Action) => action.type === 'DELETE_QUEUE_ENTRY')
         .mergeMap(({ payload: {key} }) => {
           const promise = firebase
             .child('queues').child(key).remove().
              then(value => {
                return deleteQueueEntryDone();
              })
             .catch(e => {
                console.log(e);
              });
           return Observable.from(promise);
         });

export const epics = [
  deleteQueueEntryEpic,
];
