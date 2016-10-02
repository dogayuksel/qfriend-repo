/* @flow */
export const ADMIN_CHECK_SUCCESS = 'ADMIN_CHECK_SUCCESS';
export const ADD_QUEUE_ENTRY = 'ADD_QUEUE_ENTRY';
export const SET_ACTIVE_ENTRY = 'SET_ACTIVE_ENTRY';

export const adminCheck = (user: Object) => ({ firebase }: any) => {
  const getPromise = async () => {
    const adminCheck = await firebase
      .child(`/admins/${user.id}`)
      .once('value', (value) => value);
    return adminCheck;
  }
  return {
    type: 'ADMIN_CHECK',
    payload: getPromise(),
  };
}

export const setActiveEntry = (snap: Object) => {
  return {
    type: SET_ACTIVE_ENTRY,
    payload: snap,
  };
};

export const addQueueEntry = (activeEntry, queueData, viewer) => {
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
