/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import EventForm from './EventForm';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { saveEvent } from '../../common/events/actions';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';

class NewEvent extends React.Component {

  onFormSubmit = () => {
    const { fields } = this.props;
    const { hours, minutes, daymonth, ...event } = fields.$values();
    event.beginsAt = moment(daymonth)
      .add(hours, 'hours').add(minutes, 'minutes').valueOf();
    event.facebookEventId = '';
    this.props.saveEvent(event, '', fields);
  }

  handleSelect = (date, fields) => {
    fields.$setValue('daymonth', date.valueOf());
  }

  render() {
    const { isExact, isAdmin, event, fields } = this.props;

    return (
      <EventForm
        fields={fields}
        isAdmin={isAdmin}
        isExact={isExact}
        onSubmit={this.onFormSubmit}
        handleCalendar={this.handleSelect}
      />
    );
  }
}

NewEvent = fields({
  path: 'newEvent',
  fields: [
    'name',
    'photoURL',
    'residentAdvisorURL',
    'facebookEventURL',
    'description',
    'venueKey',
    'isFeatured',
    'beginsAt',
    'daymonth',
    'hours',
    'minutes',
  ],
  getInitialState: () => ({
    hours: 23,
    minutes: 45,
    isFeatured: false,
    description: '',
    name: '',
    photoURL: '',
    residentAdvisorURL: '',
    facebookEventURL: '',
  }),
})(NewEvent);

export default connect((state: State, props) => {
  return {
    isAdmin: state.admin.isAdmin,
    venues: state.venues.venueList,
  };
},{ saveEvent })(NewEvent);
