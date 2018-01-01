/* @flow */
import { Observable } from 'rxjs/Observable';
import type { Action, Deps } from '../types';
import { appError } from '../app/actions';

export const checkAllQueues = (snap: Object): Action => {
  const queues = snap.val();
  return {
    type: 'CHECK_ALL_QUEUES',
    payload: queues,
  };
};

export const deleteQueueEntryDone = (): Action => ({
  type: 'DELETE_QUEUE_ENTRY_DONE',
});

export const deleteQueueEntry = (key: string): Action => ({
  type: 'DELETE_QUEUE_ENTRY',
  payload: { key },
});

const deleteQueueEntryEpic = (action$: any, { firebase }: Deps) =>
  action$.filter((action: Action) =>
    action.type === 'DELETE_QUEUE_ENTRY')
         .mergeMap(({ payload: { key } }) =>
           Observable.from(firebase
             .child('queues').child(key).remove()
             .then(() => deleteQueueEntryDone())
             .catch(e => Observable.of(appError(e)))
           )
         );

export const epics = [
  deleteQueueEntryEpic,
];
