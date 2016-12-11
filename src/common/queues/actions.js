/* @flow weak */
import { Observable } from 'rxjs/Observable';

export const CHECK_ALL_QUEUES = 'CHECK_ALL_QUEUES';
export const DELETE_QUEUE_ENTRY = 'DELETE_QUEUE_ENTRY';
export const DELETE_QUEUE_ENTRY_DONE = 'DELETE_QUEUE_ENTRY_DONE';

export const checkAllQueues = (snap: Object) => {
  const queues = snap.val();
  return {
    type: CHECK_ALL_QUEUES,
    payload: queues,
  };
};

export const deleteQueueEntryDone = () => {
  return {
    type: DELETE_QUEUE_ENTRY_DONE,
  };
};

export const deleteQueueEntry = (key: number) => {
    return {
      type: DELETE_QUEUE_ENTRY,
      payload: { key },
    };
};

const deleteQueueEntryEpic = (action$, {firebase}) =>
  action$.ofType(DELETE_QUEUE_ENTRY)
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
