/* @flow */
export const ON_ADMIN_CHECK = 'ON_ADMIN_CHECK';
export const ADD_QUEUE_ENTRY = 'ADD_QUEUE_ENTRY';
export const DELETE_QUEUE_ENTRY = 'DELETE_QUEUE_ENTRY';
export const SET_ACTIVE_ENTRY = 'SET_ACTIVE_ENTRY';

export const onAdminCheck = (snap: Object) => {
  const adminCheck = snap.val();
  return {
    type: ON_ADMIN_CHECK,
    payload: { adminCheck },
  };
};

export function setActiveEntry(target) {
  return {
    type: SET_ACTIVE_ENTRY,
    payload: target,
  };
}

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
}

export function deleteQueueEntry(item, entryKey) {
  const markerKey = item.get('key');
  return ({ firebase }) => {
    const getPromise = async () => {
      const deleteEntry = await firebase
	.child('locations')
        .child(markerKey.toString())
	.child('queue')
        .child('20150507')
        .child(entryKey)
	.remove();
      return deleteEntry;
    };
    return {
      type: 'DELETE_QUEUE_ENTRY',
      payload: getPromise(),
    };
  };
}
