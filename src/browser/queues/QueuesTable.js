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

const EventLink = ({ type, address }) => {
  if (address) {
    return (
      <Link to={address}>
        {type}
      </Link>
    );
  }
  return null;
};


type TableData = { [date: string]: number };

let QueuesTable = (props: Props) => {
  const { data, events, venueKey } = props;

  const calculateAverage = R.compose(
    R.mean(),
    R.pluck('y'),
  );
  const tableData: TableData = R
    .map((dataArray) => calculateAverage(dataArray))(data);

  const prepareDates = R.compose(
    R.reverse(),
    R.sortBy((date) => tableData[date]),
    R.keys(),
  );
  const dates: Array<string> = prepareDates(tableData);

  const prepEventDate = (timeStamp) => moment(timeStamp)
    .add(1, 'days').format('YYYYMMDD');

  const eventsList = R.pipe(
    R.map((e) => ({ ...e, venueKey: parseInt(e.venueKey, 10) })),
    R.map((e) => ({ ...e, beginsAt: prepEventDate(e.beginsAt) })),
    R.filter(R.propEq('venueKey', venueKey)),
  )(events);

  const findFBEventAtDate = (date, events) => R.pipe(
    R.filter(R.propEq('beginsAt', date)),
    R.pluck('facebookEventURL'),
    R.last(),
  )(events);

  const findRAEventAtDate = (date, events) => R.pipe(
    R.filter(R.propEq('beginsAt', date)),
    R.pluck('residentAdvisorURL'),
    R.last(),
  )(events);

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
            <EventLink
              address={findFBEventAtDate(date, eventsList)}
              type="FB"
            />
            <Text>&nbsp;</Text>
            <EventLink
              address={findRAEventAtDate(date, eventsList)}
              type="RA"
            />
          </Text>
        </Box>
      )}
    </Box>
  );
};

QueuesTable = firebase((database, props) => {
  const timeThresh = moment([2017, 5]).format('X');
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .endAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(QueuesTable);

export default connect((state: State) => ({
  events: state.events.eventList,
}), { getAllEvents })(QueuesTable);
