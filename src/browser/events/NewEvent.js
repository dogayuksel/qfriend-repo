/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import EventForm from './EventForm';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { saveEvent } from '../../common/events/actions';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Button,
         Link,
         Form,
         Input,
         Flex,
         Select,
         View } from '../app/components';
import { fields } from '../../common/lib/redux-fields';

class NewEvent extends React.Component {

  static propTypes = {
    event: React.PropTypes.object,
  };

  onFormSubmit = () => {
    const { fields } = this.props;
    const { hours, minutes, daymonth, ...event } = fields.$values();
    event['beginsAt'] = moment(daymonth)
      .add(hours, 'hours').add(minutes, 'minutes').valueOf();
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

NewEvent = fields(NewEvent, {
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
    venueKey: "1",
    hours: 23,
    minutes: 45,
    isFeatured: false,
  }),
});

export default connect((state: State, props) => {
  return {
    isAdmin: state.admin.isAdmin,
    venues: state.venues.venueList,
  };
},{ saveEvent })(NewEvent);
