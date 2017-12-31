/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import type { State } from '../../common/types';
import EventForm from './EventForm';
import { saveEvent } from '../../common/events/actions';
import { fields } from '../../common/lib/redux-fields';

class NewEvent extends React.Component<{}> {

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
    const { fields } = this.props;

    return (
      <EventForm
        fields={fields}
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

export default connect((state: State) => ({
  isAdmin: state.admin.isAdmin,
  venues: state.venues.venueList,
}), { saveEvent })(NewEvent);
