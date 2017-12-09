/* @flow */
import { Observable } from 'rxjs/Observable';
import type { Action, Deps, User, Queue } from '../types';

export const adminCheck = (user: ?User): Action => ({
  type: 'ADMIN_CHECK',
  payload: { user },
});

export const adminCheckDone = (): Action => ({
  type: 'ADMIN_CHECK_DONE',
});

export const adminCheckFail = (): Action => ({
  type: 'ADMIN_CHECK_FAIL',
  payload: { error: 'not admin' },
});

export const setActiveEntry = (venueKey: number): Action => ({
  type: 'SET_ACTIVE_ENTRY',
  payload: { venueKey },
});

export const addQueueEntry = (activeEntry: number, queueData: Queue, viewer: User): Action => {
  const owner = viewer;
  delete owner.email;
  return {
    type: 'ADD_QUEUE_ENTRY',
    payload: { activeEntry, queueData, owner },
  };
};

export const addQueueEntryDone = (): Action => ({
  type: 'ADD_QUEUE_ENTRY_DONE',
});

const addQueueEntryEpic = (action$: any, { firebase, firebaseDatabase }: Deps) =>
  action$
    .filter((action: Action) => action.type === 'ADD_QUEUE_ENTRY')
    .mergeMap(({ payload: { owner, activeEntry, queueData } }) => {
      const promise = firebase
        .child('queues').push({
          value: parseInt(queueData.value, 10),
          owner,
          venueKey: activeEntry,
          loggedAt: firebaseDatabase.ServerValue.TIMESTAMP,
        })
        .then(() => addQueueEntryDone())
        .catch((e) => {
          console.log(e);
        });
      return Observable.from(promise);
    });

const adminCheckEpic = (action$: any, { firebase }: Deps) =>
  action$
    .filter((action: Action) => action.type === 'ADMIN_CHECK')
    .mergeMap(({ payload: { user } }) => {
      const promise = user && firebase
        .child(`/admins/${user.uid}`)
        .once('value', (value) => value)
        .then(value => {
          if (value.val() && value.val().isAdmin) {
            return adminCheckDone();
          }
          return adminCheckFail();
        })
        .catch(e => {
          console.log('error', e);
        });
      if (user) {
        return Observable.from(promise);
      }
      return Observable.of();
    });

export const epics = [
  adminCheckEpic,
  addQueueEntryEpic,
];
