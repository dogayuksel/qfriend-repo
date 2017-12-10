/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import Select from 'react-select';

// https://javascriptplayground.com/blog/
//   2016/07/css-modules-webpack-react/
import styles from './custom-select-calendar-styles.css';

import R from 'ramda';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Button,
         Link,
         Form,
         Input,
         Checkbox,
         Box } from '../app/components';
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
    venues: React.PropTypes.array.isRequired,
  };

  render() {
    const { isAdmin,
            fields,
            daymonth,
            onSubmit,
            handleCalendar,
            isExact,
            venues } = this.props;

    const pickMix = (venue) => ({
      label: venue['title'],
      value: venue['key'],
    });
    const activeFilter = (venue) => venue.active === 1;
    const venueMap = R.map(pickMix, R.filter(activeFilter, venues));

    return (
      <Box margin={1}>
        <Link to="/editevents">
          <Button primary>Back</Button>
        </Link>
        <Form onSubmit={onSubmit}>
          <Input
            field={fields.name}
            maxLength={100}
            label="Event Name"
            type="text"
            placeholder="Short Name"
          />
          <Input
            field={fields.description}
            maxLength={10000}
            label="Event description"
            type="text"
            placeholder="Details of the event"
            rows={7}
          />
          <Input
            field={fields.photoURL}
            label="Photo URL"
            type="text"
            placeholder="http://..."
          />
          <Input
            field={fields.residentAdvisorURL}
            label="Resident Advisor URL"
            type="url"
            placeholder="http://..."
          />
          <Input
            field={fields.facebookEventURL}
            label="Facebook event URL"
            type="url"
            placeholder="http://..."
          />
          <Box paddingBottom={1}>
            <Checkbox
              field={fields.isFeatured}
              label="Featured event?"
            />
          </Box>
          <Box width={7}>
            <Select
              placeholder="Select venue"
              value={parseInt(fields.venueKey.value, 10)}
              name="Venue"
              options={venueMap}
              onChange={(selection) =>
                fields.$setValue('venueKey',
                                 selection ? "" + selection.value : null)}
            />
          </Box>
          <Box
            display="flex"
            marginVertical={0.5}
          >
            <Input
              width={2}
              field={fields.hours}
              label="hour"
              type="text"
              placeholder=""
            />
            <Input
              width={2}
              field={fields.minutes}
              label="minute"
              type="text"
              placeholder=""
            />
          </Box>
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
          <Box>
            <Button
              onClick={onSubmit}
              success
            >
              Save
            </Button>
          </Box>
        </Form>
      </Box>
    );
  }
}

export default connect((state: State) => ({
  venues: state.venues.venueList,
}))(EventForm);
