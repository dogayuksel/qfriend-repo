/* @flow */
import { Observable } from 'rxjs/Observable';
import type { Action, Deps, Event } from '../types';
import { appError } from '../app/actions';

export const getAllEvents = (snap: Object): Action => {
  const events = snap.val();
  return {
    type: 'GET_ALL_EVENTS',
    payload: { events },
  };
};

export const getOneEvent = (snap: Object): Action => {
  const event = snap.val();
  const eventKey = snap.key;
  return {
    type: 'GET_ONE_EVENT',
    payload: { event, eventKey },
  };
};

export const reportEventClick = (linkType: string): Action => ({
  type: 'REPORT_EVENT_LINK_CLICK',
  payload: { linkType },
});

export const saveEvent = (
  event: Event, eventKey: string, fields: ?Object
): Action => ({
  type: 'SAVE_EVENT',
  payload: { event, eventKey, fields },
});

export const saveEventDone = (): Action => ({
  type: 'SAVE_EVENT_DONE',
});

export const saveEventFail = (): Action => ({
  type: 'SAVE_EVENT_FAILED',
});

export const deleteEvent = (eventKey: string): Action => ({
  type: 'DELETE_EVENT',
  payload: { eventKey },
});

export const deleteEventDone = (): Action => ({
  type: 'DELETE_EVENT_DONE',
});

const saveEventEpic = (action$: any, { firebase }: Deps) => {
  const updateEvent = (eventKey, event) => Observable
    .from(firebase.child('events').child(eventKey).update(event));

  const saveNewEvent = (event) => Observable
    .from(firebase.child('events').push(event));

  const saveEvent$ = ({ payload: { event, eventKey, fields } }) => {
    if (!fields) {
      return updateEvent(eventKey, event);
    }
    fields.$reset();
    return saveNewEvent(event);
  };

  return action$
    .filter((action: Action) => action.type === 'SAVE_EVENT')
    .mergeMap(saveEvent$)
    .delay(600)
    .map(saveEventDone)
    .catch(e => Observable.from(
      [appError(e), saveEventFail()]
    ));
};

const deleteEventEpic = (action$: any, { firebase }: Deps) =>
  action$
    .filter((action: Action) => action.type === 'DELETE_EVENT')
    .mergeMap(({ payload: { eventKey } }) => {
      const promise = firebase
        .child('events')
        .child(eventKey)
        .remove()
        .then(() => deleteEventDone())
        .catch(e => Observable.of(appError(e)));
      return Observable.from(promise);
    });

export const epics = [
  saveEventEpic,
  deleteEventEpic,
];
