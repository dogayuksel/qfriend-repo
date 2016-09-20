/* @flow */
export const CHECK_QUEUES = 'CHECK_QUEUES';

export const checkQueues = (snap: Object) => {
  const queues = snap.val();
  return {
    type: CHECK_QUEUES,
    payload: queues,
  };
};
