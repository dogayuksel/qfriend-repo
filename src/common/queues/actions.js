/* @flow */
export const CHECK_QUEUES = 'CHECK_QUEUES';
export const CHECK_ALL_QUEUES = 'CHECK_ALL_QUEUES';
export const DELETE_QUEUE_ENTRY_START = 'DELETE_QUEUE_ENTRY_START';
export const DELETE_QUEUE_ENTRY_SUCCESS = 'DELETE_QUEUE_ENTRY_SUCCESS';

export const checkQueues = (snap: Object) => {
  const queues = snap.val();
  return {
    type: CHECK_QUEUES,
    payload: queues,
  };
};

export const checkAllQueues = (snap: Object) => {
  const queues = snap.val();
  return {
    type: CHECK_ALL_QUEUES,
    payload: queues,
  };
};

export const deleteQueueEntry = (key: number) => {
  return ({ firebase }: any) => {
    const getPromise = async () => {
      const deleteItem = await firebase
        .child('queues').child(key).remove();
      return deleteItem;
    };
    return {
      type: 'DELETE_QUEUE_ENTRY',
      payload: getPromise(),
    };
  };
};
