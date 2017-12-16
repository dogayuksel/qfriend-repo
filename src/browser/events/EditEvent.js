/* @flow */
import React from 'react';
import R from 'ramda';
import moment from 'moment';
import { connect } from 'react-redux';

import type { State, Event } from '../../common/types';
import EventForm from './EventForm';
import { saveEvent } from '../../common/events/actions';
import { fields } from '../../common/lib/redux-fields';

type Props = {
  event: Event,
  params: { eventKey: string },
  isExact: boolean,
  isAdmin: boolean,
  saveEvent: typeof saveEvent,
  fields: any,
}

class EditEvent extends React.Component<Props> {

  componentWillUnmount = () => {
    this.props.fields.$reset();
  }

  onFormSubmit = () => {
    const {
      hours,
      minutes,
      daymonth,
      ...event
    } = this.props.fields.$values();
    const { saveEvent, params: { eventKey } } = this.props;
    const beginsAt = moment(daymonth)
      .add(hours, 'hours').add(minutes, 'minutes').valueOf();
    const prepareEvent = R.compose(
      R.assoc('beginsAt', beginsAt),
    );
    const newEvent = prepareEvent(event);
    saveEvent(newEvent, eventKey, null);
  }

  handleSelect = (date, fields) => {
    fields.$setValue('daymonth', date.valueOf());
  }

  render() {
    const { isExact, isAdmin, event, fields } = this.props;
    const { eventKey } = this.props.params;
    const time = moment(event.beginsAt);
    const hours = time.hours();
    const minutes = time.minutes();
    const daymonth = time.subtract(hours, 'hours')
                         .subtract(minutes, 'minutes')
                         .valueOf();

    return (
      <EventForm
        fields={fields}
        daymonth={daymonth}
        isAdmin={isAdmin}
        isExact={isExact}
        eventKey={eventKey}
        onSubmit={this.onFormSubmit}
        handleCalendar={this.handleSelect}
      />
    );
  }
}

/* eslint-disable no-class-assign*/
EditEvent = fields({
  /* eslint-enable no-class-assign*/
  path: 'editEvent',
  fields: [
    'name',
    'photoURL',
    'residentAdvisorURL',
    'facebookEventURL',
    'description',
    'venueKey',
    'isFeatured',
    'daymonth',
    'hours',
    'minutes',
  ],
  getInitialState: props => {
    const { event } = props;
    const { name,
            description,
            photoURL,
            residentAdvisorURL,
            facebookEventURL,
            venueKey,
            isFeatured,
            beginsAt } = event;
    const time = moment(beginsAt);
    const hours = time.hours();
    const minutes = time.minutes();
    const rest = time.subtract(hours, 'hours')
                     .subtract(minutes, 'minutes')
                     .valueOf();
    return ({
      name,
      description: description || '',
      photoURL: photoURL || '',
      residentAdvisorURL: residentAdvisorURL || '',
      facebookEventURL: facebookEventURL || '',
      venueKey,
      isFeatured,
      daymonth: rest,
      hours,
      minutes,
    });
  },
})(EditEvent);

export default connect((state: State, props) => {
  const { eventKey } = props.params;
  return {
    isAdmin: state.admin.isAdmin,
    event: state.events.eventList && state.events.eventList.find((value) => value.key === eventKey),
    venues: state.venues.venueList,
  };
}, { saveEvent })(EditEvent);
