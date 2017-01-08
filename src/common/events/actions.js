/* @flow */
import { Observable } from 'rxjs/Observable';
import type { Action, Deps, Event } from '../types';

export const getAllEvents = (snap: Object): Action => {
  const events = snap.val();
  return {
    type: 'GET_ALL_EVENTS',
    payload: { events },
  };
};

export const reportEventClick = (linkType: string): Action => {
  return {
    type: 'REPORT_EVENT_LINK_CLICK',
    payload: { linkType },
  };
};

export const saveEvent = ( event: Event, eventKey: string, fields: ?Object ): Action => {
  return {
    type: 'SAVE_EVENT',
    payload: { event, eventKey, fields },
  };
};

export const saveEventDone = (): Action => {
  return {
    type: 'SAVE_EVENT_DONE',
  };
};

export const deleteEvent = (eventKey: string): Action => {
  return {
    type: 'DELETE_EVENT',
    payload: { eventKey }
  };
};

export const deleteEventDone = (): Action => {
  return {
    type: 'DELETE_EVENT_DONE',
  };
};

const saveEventEpic = (action$: any, {firebase}: Deps) =>
  action$
  .filter((action: Action) => action.type === 'SAVE_EVENT')
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

const deleteEventEpic = (action$: any, {firebase}: Deps) =>
  action$
  .filter((action: Action) => action.type === 'DELETE_EVENT')
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
