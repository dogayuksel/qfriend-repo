/* @flow */
export const ON_ADMIN_CHECK = 'ON_ADMIN_CHECK';
export const ADD_QUEUE_ENTRY = 'ADD_QUEUE_ENTRY';
export const SET_ACTIVE_ENTRY = 'SET_ACTIVE_ENTRY';

export const onAdminCheck = (snap: Object) => {
  const adminCheck = snap.val();
  return {
    type: ON_ADMIN_CHECK,
    payload: { adminCheck },
  };
};

export const setActiveEntry = (snap: Object) => {
  return {
    type: SET_ACTIVE_ENTRY,
    payload: snap,
  };
};

export function addQueueEntry(activeEntry, queueData, viewer) {
  return ({ firebase, firebaseDatabase }) => {
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
