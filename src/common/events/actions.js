/* @flow weak */
import { Observable } from 'rxjs/Observable';

export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const SAVE_EVENT = 'SAVE_EVENT';
export const SAVE_EVENT_DONE = 'SAVE_EVENT_DONE';
export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_DONE = 'DELETE_EVENT_DONE';
export const REPORT_EVENT_LINK_CLICK = 'REPORT_EVENT_LINK_CLICK';

export const getAllEvents = (snap: Object) => {
  const events = snap.val();
  return {
    type: GET_ALL_EVENTS,
    payload: { events },
  };
};

export const reportEventClick = (type: string) => {
  return {
    type: REPORT_EVENT_LINK_CLICK,
    payload: type,
  };
};

export const saveEvent = ( event: Object, eventKey: ?string, fields: ?Object ) => {
  return {
    type: SAVE_EVENT,
    payload: { event, eventKey, fields },
  };
};

export const saveNewEvent = ( event: Object, fields: Object ) => ({dispatch}) => {
  dispatch(saveEvent(event, "0", fields));
  return {
    type: 'SAVE_NEW_EVENT',
  };
};

export const saveEventDone = () => {
  return {
    type: SAVE_EVENT_DONE,
  };
};

export const deleteEvent = (eventKey) => {
  return {
    type: DELETE_EVENT,
    payload: { eventKey }
  };
};

export const deleteEventDone = () => {
  return {
    type: DELETE_EVENT_DONE,
  };
};

const saveEventEpic = (action$, {firebase}) =>
  action$.ofType(SAVE_EVENT)
         .mergeMap(({ payload: { event, eventKey, fields } }) => {
           if (!fields) {
             const promise = firebase
               .child('events')
               .child(eventKey)
               .update({
                 ...event
               })
               .then(value => {
                 return saveEventDone();
               })
               .catch(e => {
                 console.log(e);
               });
             return Observable.from(promise);
           } else {
             const promise = firebase
               .child('events')
               .push(event)
               .then(value => {
                 fields.$reset();
                 return saveEventDone();
               })
               .catch(e => {
                 console.log(e);
               })
             return Observable.from(promise);
           }
         });

const deleteEventEpic = (action$, {firebase}) =>
  action$.ofType(DELETE_EVENT)
         .mergeMap(({ payload: { eventKey } }) => {
           const promise = firebase
             .child('events')
             .child(eventKey)
             .remove()
             .then(value => {
               return deleteEventDone();
             })
             .catch(e => {
               console.log(e);
             });
           return Observable.from(promise);
         });

export const epics = [
  saveEventEpic,
  deleteEventEpic,
];
