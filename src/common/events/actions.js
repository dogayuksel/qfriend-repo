/* @flow */
export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const SAVE_EVENT_SUCCESS = 'SAVE_EVENT_SUCCESS';
export const SAVE_NEW_EVENT_SUCCESS = 'SAVE_NEW_EVENT_SUCCESS';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';

export const getAllEvents = (snap: Object) => {
  const events = snap.val();
  return {
    type: GET_ALL_EVENTS,
    payload: { events },
  };
};

export const saveEvent = ( event: Object, eventKey: String ) => {
  return ({ firebase }: any) => {
    const getPromise = async () => {
      const updateEvent = await firebase
        .child('events').child(eventKey).update({
          ...event
        });
      return updateEvent;
    };
    return {
      type: 'SAVE_EVENT',
      payload: getPromise(),
    };
  };
};

export const saveNewEvent = ( event: Object, fields: Object ) => {
  return ({ firebase }: any) => {
    const getPromise = async () => {
      const appendEvent = await firebase
        .child('events').push(event);
      fields.$reset();
      return appendEvent;
    };
    return {
      type: 'SAVE_NEW_EVENT',
      payload: getPromise(),
    };
  };
};

export const deleteEvent = ( eventKey: String ) => {
  return ({ firebase }: any) => {
    const getPromise = async () => {
      const deleteEvent = await firebase
        .child('events').child(eventKey).remove();
      return deleteEvent;
    };
    return {
      type: 'DELETE_EVENT',
      payload: getPromise(),
    };
  };
};
