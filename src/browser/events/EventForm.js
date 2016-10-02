/* @flow */
import React from 'react';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { saveNewEvent } from '../../common/events/actions';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Button,
         Link,
         Form,
         Input,
         Textarea,
         Flex,
         Select,
         View } from '../app/components';
import { fields } from '../../common/lib/redux-fields';

class EventForm extends React.Component {

  static propTypes = {
    eventKey: React.PropTypes.string,
    daymonth: React.PropTypes.number,
    fields: React.PropTypes.object.isRequired,
    isAdmin: React.PropTypes.bool.isRequired,
    isExact: React.PropTypes.bool.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    handleCalendar: React.PropTypes.func.isRequired,
    venues: React.PropTypes.object.isRequired,
  };

  render() {
    const { isAdmin,
            fields,
            daymonth,
            onSubmit,
            handleCalendar,
            isExact,
            venues } = this.props;
    const venueMap = venues.map((value) => {
      const { title, key } = value
      return ({
        children: title,
        value: key,
      });
    }).toJS();

    return (
      <View mt={2} mb={3}>
        <Link to="/editevents">
          <Text mt={3} mb={2}>Back</Text>
        </Link>
        <Form mr={2} onSubmit={onSubmit}>
          <Input
            {...fields.name}
            maxLength={100}
            label="Event Name"
            type="text"
          />
          <Textarea
            {...fields.description}
            maxLength={300}
            label="Event description"
            type="textarea"
          />
          <Input
            {...fields.photoURL}
            label="Photo URL"
            type="text"
          />
          <Select
            {...fields.venueKey}
            label="Venue"
            options={venueMap}
          />
          <Flex>
            <Input
              {...fields.hours}
              label="hour"
              type="number"
            />
            <Input
              {...fields.minutes}
              label="minute"
              type="number"
            />
          </Flex>
          <Calendar
            onChange={(value) => handleCalendar(value, fields)}
            onInit={(value) => handleCalendar(value, fields)}
            date={daymonth ? moment(daymonth) : moment()}
            theme={{
              Calendar: {
                width: 250,
                background: 'tranparent',
                color: '#dddddd',
              },
              DaySelected: {
                background: '#ffdd18',
                color: '#222',
              }
            }}
          />
          <Flex align="center">
            <Button
              theme="primary"
              type="submit"
            >
              Save
            </Button>
          </Flex>
        </Form>
      </View>
    );
  }
}

export default connect(state => ({
  venues: state.venues.venueList,
}))(EventForm);
