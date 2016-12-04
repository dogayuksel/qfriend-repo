/* @flow */
import { Observable } from 'rxjs/Observable';

export const ADMIN_CHECK = 'ADMIN_CHECK';
export const ADMIN_CHECK_DONE = 'ADMIN_CHECK_DONE';
export const ADD_QUEUE_ENTRY = 'ADD_QUEUE_ENTRY';
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

export const setActiveEntry = (snap: Object) => {
  return {
    type: SET_ACTIVE_ENTRY,
    payload: snap,
  };
};

export const addQueueEntry = (activeEntry: Number,
                              queueData: Object,
                              viewer: Object) => {
  return ({ firebase, firebaseDatabase }: any) => {
    const getPromise = async () => {
      const userWithoutEmail = viewer.toJS();
      delete userWithoutEmail.email;
      const addEntry = await firebase
	.child('queues').push({
          value: parseInt(queueData.value, 10),
          owner: userWithoutEmail,
          venueKey: activeEntry,
          loggedAt: firebaseDatabase.ServerValue.TIMESTAMP,
        });
      return addEntry;
    };
    return {
      type: 'ADD_QUEUE_ENTRY',
      payload: getPromise(),
    };
  };
};

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
          }
        });
      if (user) {
        return Observable.from(promise);
      }
      return Observable.of();
    });
}

export const epics = [
  adminCheckEpic,
];
