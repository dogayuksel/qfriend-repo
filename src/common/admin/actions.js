/* @flow weak */
import { Observable } from 'rxjs/Observable';

export const ADMIN_CHECK = 'ADMIN_CHECK';
export const ADMIN_CHECK_DONE = 'ADMIN_CHECK_DONE';
export const ADMIN_CHECK_FAIL = 'ADMIN_CHECK_FAIL';
export const ADD_QUEUE_ENTRY = 'ADD_QUEUE_ENTRY';
export const ADD_QUEUE_ENTRY_DONE = 'ADD_QUEUE_ENTRY_DONE';
export const SET_ACTIVE_ENTRY = 'SET_ACTIVE_ENTRY';

export const adminCheck = (user: Object) => {
  return {
    type: ADMIN_CHECK,
    payload: { user },
  };
}

export const adminCheckDone = () => ({
    type: ADMIN_CHECK_DONE,
});

export const adminCheckFail = () => ({
  type: ADMIN_CHECK_FAIL,
  payload: { error: 'not admin' },
});

export const setActiveEntry = (snap: Object) => {
  return {
    type: SET_ACTIVE_ENTRY,
    payload: snap,
  };
};

export const addQueueEntry = (activeEntry: Number, queueData: Object, viewer: Object) => {
  const userWithoutEmail = viewer;
  delete userWithoutEmail.email;
  return {
    type: ADD_QUEUE_ENTRY,
    payload: {userWithoutEmail, activeEntry, queueData},
  };
};

export const addQueueEntryDone = () => {
  return {
    type: ADD_QUEUE_ENTRY_DONE,
  };
};

const addQueueEntryEpic = (action$, { firebase, firebaseDatabase }) =>
  action$.ofType(ADD_QUEUE_ENTRY)
         .mergeMap(({ payload: { userWithoutEmail, activeEntry, queueData } }) => {
           const promise = firebase
             .child('queues').push({
               value: parseInt(queueData.value, 10),
               owner: userWithoutEmail,
               venueKey: activeEntry,
               loggedAt: firebaseDatabase.ServerValue.TIMESTAMP,
             })
             .then((value) => {
               return addQueueEntryDone();
             })
             .catch((e) => {
               console.log(e);
             });
           return Observable.from(promise);
         });

const adminCheckEpic = (action$, { firebase, user }) => {
  return action$
    .ofType(ADMIN_CHECK)
    .mergeMap(({ payload: { user } }) => {
      const promise = user && firebase
        .child(`/admins/${user.uid}`)
        .once('value', (value) => value)
        .then(value => {
          if (value.val() && value.val().isAdmin) {
            return adminCheckDone();
          } else {
            return adminCheckFail();
          }
        })
        .catch(e => {
          console.log('error', e);
        });
      if (user) {
        return Observable.from(promise);
      }
      return Observable.of();
    });
}

export const epics = [
  adminCheckEpic,
  addQueueEntryEpic,
];
