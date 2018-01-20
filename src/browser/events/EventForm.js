/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import Select from 'react-select';

// https://javascriptplayground.com/blog/
//   2016/07/css-modules-webpack-react/
/* eslint-disable no-unused-vars */
import selectStyles from './../app/components/react-select.css';
import customStyles from './custom-select-calendar-styles.css';
/* eslint-enable no-unused-vars */

import type { State, Venue } from '../../common/types';
import {
  Paragraph,
  Text,
  Button,
  Link,
  Form,
  Input,
  Checkbox,
  Box,
} from '../app/components';

type Props = {
  fields: Object,
  daymonth: number,
  eventBeingSaved: boolean,
  onSubmit: () => void,
  handleCalendar: (date: moment<>, fields: Object) => void,
  venues: Array<Venue>,
  error: ?Object,
};

const EventForm = ({
  fields,
  daymonth,
  onSubmit,
  handleCalendar,
  venues,
  eventBeingSaved,
  error,
}: Props) => {
  const pickMix = (venue) => ({
    label: venue.title,
    value: venue.key,
  });
  const activeFilter = (venue) => venue.active === 1;
  const venueMap = R.map(pickMix, R.filter(activeFilter, venues));

  const venueSelected = (fields.venueKey.value === 'undefined' || !fields.venueKey.value) ?
                        false : true;
  const dateSelected = (fields.daymonth.value === "") ? false : true;

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
                               selection ? `${selection.value}` : null)}
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
            },
          }}
        />
        {error &&
         <Box marginVertical={1}>
           <Paragraph color="warning">
             {error.message}
           </Paragraph>
           <Paragraph color="warning">
             Please, refresh the app.
           </Paragraph>
         </Box>
        }
        <Box>
          <Button
            disabled={!venueSelected || !dateSelected}
            onClick={onSubmit}
            success
          >
            Save
          </Button>
          {(!venueSelected && !eventBeingSaved) &&
           <Text marginLeft={0.5} color="primary">
             You must select a venue
           </Text>
          }
          {(!dateSelected && !eventBeingSaved) &&
           <Text marginLeft={0.5} color="primary">
             You must select a date
           </Text>
          }
          {eventBeingSaved &&
           <Text marginLeft={0.5} bold color="primary">
             Event is being saved...
           </Text>
          }
        </Box>
      </Form>
    </Box>
  );
};

export default connect((state: State) => ({
  eventBeingSaved: state.events.eventBeingSaved,
  venues: state.venues.venueList,
  error: state.app.error,
}))(EventForm);
