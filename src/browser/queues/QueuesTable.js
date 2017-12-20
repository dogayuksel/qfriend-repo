/* @flow */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import R from 'ramda';

import { Box, Text, Link } from '../app/components';
import { firebase } from '../../common/lib/redux-firebase';
import { getAllEvents } from '../../common/events/actions';
import type { State, Event } from '../../common/types';

type DataPoint = {
  x: number,
  y: number,
}

type QueuesData = {
  [date: string]: Array<DataPoint>,
}

type Props = {
  data: QueuesData,
  events: Array<Event>,
  venueKey: number,
}

type TableData = { [date: string]: number };

let QueuesTable = (props: Props) => {
  const { data, events } = props;

  const calculateAverage = R.compose(
    R.mean(),
    R.pluck('y'),
  );
  const tableData: TableData = R
    .map((dp) => calculateAverage(dp))(data);

  const prepareDates = R.compose(
    R.reverse(),
    R.sortBy((date) => tableData[date]),
    R.keys(),
  );
  const dates: Array<string> = prepareDates(tableData);

  const getEventDate = (timeStamp) => moment(timeStamp).add(1, 'days').format('YYYYMMDD');

  const findFBEventAtDate = (date, events) => {
    for (const eve of events) {
      if (getEventDate(eve.beginsAt) === date) {
        return eve.facebookEventURL;
      }
    }
    return null;
  };

  const findRAEventAtDate = (date, events) => {
    for (const eve of events) {
      if (getEventDate(eve.beginsAt) === date) {
        return eve.residentAdvisorURL;
      }
    }
    return null;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingTop={1}
    >
      <Text bold>Date: Average Queue </Text>
      {dates.map(date =>
        <Box key={date}>
          <Text>
            {date}:&nbsp;
          </Text>
          <Text>
            {`${tableData[date].toFixed(0)}`.padStart(5)}:&nbsp;
          </Text>
          <Text>
            {findFBEventAtDate(date, events) &&
             <Link to={findFBEventAtDate(date, events)}>
               FB
             </Link>
            }
            <Text>&nbsp;</Text>
            {findRAEventAtDate(date, events) &&
             <Link to={findRAEventAtDate(date, events)}>
               RA
             </Link>
            }
          </Text>
        </Box>
      )}
    </Box>
  );
};

QueuesTable = firebase((database, props) => {
  const { venueKey } = props;
  const eventsRef = database.child('events')
                            .orderByChild('venueKey')
                            .equalTo(`${venueKey}`);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(QueuesTable);

export default connect((state: State) => ({
  events: state.events.eventList,
}), { getAllEvents })(QueuesTable);
