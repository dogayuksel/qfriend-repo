/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import EventForm from './EventForm';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { saveEvent } from '../../common/events/actions'
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

class EditEvent extends React.Component {

  static propTypes = {
    event: React.PropTypes.object,
  };

  onFormSubmit = () => {
    const { hours, minutes, daymonth, ...event } = this.props.fields.$values();
    const eventKey = this.props.params.eventKey;
    event['beginsAt'] = moment(daymonth)
      .add(hours, 'hours').add(minutes, 'minutes').valueOf();
    this.props.saveEvent(event, eventKey, null);
  }

  handleSelect = (date, fields) => {
    fields.$setValue('daymonth', date.valueOf());
  }

  componentWillUnmount = () => {
    this.props.fields.$reset();
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

EditEvent = fields({
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
      description,
      photoURL,
      residentAdvisorURL,
      facebookEventURL,
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
    event: state.events.eventList.find((value) => value.key == eventKey),
    venues: state.venues.venueList,
  };
},{ saveEvent })(EditEvent);
