/* @flow */
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
    this.props.saveEvent(event, eventKey);
  }

  handleSelect = (date, fields) => {
    fields.$setValue('daymonth', date.valueOf());
  }

  componentWillMount = () => {
    const { fields,
            event: { name,
                     description,
                     photoURL,
                     venueKey,
                     beginsAt } } = this.props;
    fields.$setValue('name', name);
    fields.$setValue('description', description);
    fields.$setValue('photoURL', photoURL);
    fields.$setValue('venueKey', venueKey);
    const time = moment(beginsAt);
    const hours = time.hours();
    const minutes = time.minutes();
    const rest = time.subtract(hours, 'hours')
                     .subtract(minutes, 'minutes')
                     .valueOf();
    fields.$setValue('daymonth', rest);
    fields.$setValue('hours', hours);
    fields.$setValue('minutes', minutes);
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

EditEvent = fields(EditEvent, {
  path: 'editEvent',
  fields: [
    'name',
    'photoURL',
    'description',
    'venueKey',
    'daymonth',
    'hours',
    'minutes',
  ],
});

export default connect((state, props) => {
  const { eventKey } = props.params;
  return {
    isAdmin: state.admin.isAdmin,
    event: state.events.eventList.find((value) => value.key == eventKey),
    venues: state.venues.venueList,
  };
},{ saveEvent })(EditEvent);
