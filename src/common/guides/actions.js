/* @flow */
import type { Action } from '../types';

export const setGuideVenue = (venueKey: number): Action => ({
  type: 'SET_GUIDE_VENUE',
  payload: { venueKey },
});

export const setGuideEvent = (eventKey: string): Action => ({
  type: 'SET_GUIDE_EVENT',
  payload: { eventKey },
});

export const setGuideDate = (guideDate: number): Action => ({
  type: 'SET_GUIDE_DATE',
  payload: { guideDate },
});
