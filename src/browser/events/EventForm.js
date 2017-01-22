/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
            placeholder="Shorten if necessary"
          />
          <Input
            field={fields.description}
            maxLength={300}
            label="Event description"
            type="text"
            placeholder="Something about the event"
            rows={3}
          />
          <Input
            field={fields.photoURL}
            label="Photo URL"
            type="text"
            placeholder=""
          />
          <Input
            field={fields.residentAdvisorURL}
            label="Resident Advisor URL"
            type="url"
            placeholder=""
          />
          <Input
            field={fields.facebookEventURL}
            label="Facebook event URL"
            type="url"
            placeholder=""
          />
          <Checkbox
            field={fields.isFeatured}
            label="Featured event?"
          />
          <Select
            marginBottom={3}
            value={parseInt(fields.venueKey.value, 10)}
            name="Venue"
            options={venueMap}
            onChange={(selection) =>
              fields.$setValue('venueKey',
                               selection ? "" + selection.value : null)}
            placeholder=""
          />
          <Box>
            <Input
              field={fields.hours}
              label="hour"
              type="text"
              placeholder=""
            />
            <Input
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
