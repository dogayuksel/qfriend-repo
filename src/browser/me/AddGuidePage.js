/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import moment from 'moment';
import Select from 'react-select';
import { Calendar } from 'react-date-range';
import { FormattedMessage } from 'react-intl';

import buttonsMessages from '../../common/app/buttonsMessages';
import linksMessages from '../../common/app/linksMessages';

import type {
  State,
  GuidesState,
  Venue,
  Event,
} from '../../common/types';

import { listVenues } from '../../common/venues/actions';
import { getAllEvents } from '../../common/events/actions';

import {
  setGuideVenue,
  setGuideEvent,
  setGuideDate,
} from '../../common/guides/actions';

import {
  Box,
  Input,
  Form,
  Title,
  Button,
} from '../app/components';

import { firebase } from '../../common/lib/redux-firebase';
import { fields } from '../../common/lib/redux-fields';

/* eslint-disable no-unused-vars */
import styles from './custom-select-calendar-styles.css';
/* eslint-enable no-unused-vars */

type Props = {
  venues: Array<Venue>,
  events: Array<Event>,
  guides: GuidesState,
  setGuideVenue: typeof setGuideVenue,
  setGuideEvent: typeof setGuideEvent,
  setGuideDate: typeof setGuideDate,
  fields: Object,
};

let AddGuidePage = ({
  venues,
  events,
  guides,
  setGuideVenue,
  setGuideEvent,
  setGuideDate,
  fields,
}: Props) => {
  const packVenues = (venue: Venue) => ({
    label: venue.title,
    value: venue.key,
  });

  const packVenueEvents = (events, venueKey, guideDate) => {
    const begin = moment(guideDate);
    const end = moment(begin).add(1, 'days');
    const filterEvents = (event: Event) => (
      parseInt(event.venueKey, 10) === venueKey &&
      moment(event.beginsAt).isBetween(begin, end, null, '[]')
    );
    const packEvents = (event: Event) => ({
      label: event.name,
      value: event.key,
    });
    return R.map(packEvents, R.filter(filterEvents, events));
  };

  const onSubmit = () => {
    fields.$setValue('guideVenue', guides.guideVenue);
    fields.$setValue('guideEvent', guides.guideEvent);
    fields.$setValue('guideDate', guides.guideDate);
    const values = fields.$values();
    alert(JSON.stringify(values)); // eslint-disable-line no-alert
    fields.$reset();
  };

  return (
    <Box>
      <Title message={linksMessages.addGuide} />
      <Form
        maxWidth={21}
        onSubmit={onSubmit}
      >
        <Box>
          <Calendar
            onChange={(value) => setGuideDate(value.valueOf())}
            onInit={(value) => setGuideDate(value.valueOf())}
            date={guides.guideDate ? moment(guides.guideDate) : moment()}
            theme={{
              Calendar: {
                width: 250,
                background: 'tranparent',
                color: '#dddddd',
              },
              DaySelected: {
                background: '#ffdd18',
                color: '#222',
              },
            }}
          />
        </Box>
        <Select
          placeholder="Select venue"
          value={guides.guideVenue}
          name="Venue"
          options={R.map(packVenues, venues)}
          onChange={(selection) => setGuideVenue(selection.value)}
        />
        <Select
          placeholder="Select event"
          value={guides.guideEvent}
          name="Event"
          options={packVenueEvents(
              events, guides.guideVenue, guides.guideDate)}
          onChange={(selection) => setGuideEvent(selection.value)}
        />
        <Input
          field={fields.guideContent}
          maxLength={10000}
          label="Guide Text"
          type="text"
          placeholder="Details of the event"
          rows={7}
        />
        <Button primary onClick={onSubmit}>
          <FormattedMessage {...buttonsMessages.submit} />
        </Button>
      </Form>
    </Box>
  );
};


AddGuidePage = fields({
  path: 'guidePage',
  fields: [
    'guideDate',
    'guideVenue',
    'guideEvent',
    'guideContent',
  ],
  getInitialState: () => ({
    guideContent: '',
  }),
})(AddGuidePage);

AddGuidePage = firebase((database, props) => {
  const locationsLogRef = database.child('locations');
  return [
    [locationsLogRef, 'on', 'value', props.listVenues],
  ];
})(AddGuidePage);

AddGuidePage = firebase((database, props) => {
  const timeThresh = moment().subtract(3, 'days').valueOf();
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(AddGuidePage);

export default connect((state: State) => ({
  viewer: state.users.viewer,
  venues: state.venues.venueList,
  events: state.events.eventList,
  guides: state.guides,
}), {
  listVenues,
  getAllEvents,
  setGuideVenue,
  setGuideEvent,
  setGuideDate,
})(AddGuidePage);
