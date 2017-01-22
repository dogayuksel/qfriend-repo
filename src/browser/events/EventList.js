/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import Event from './Event';
import moment from 'moment';
import R from 'ramda';
import { connect } from 'react-redux';
import { getAllEvents } from '../../common/events/actions';
import { listVenues } from '../../common/venues/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Box,
         Heading,
         Loading,
         Text } from '../app/components';

const styles = {
  eventList: {
    width: '80vw',
    maxWidth: '950px',
    margin: 'auto',
  },
};

let EventList = ({ events, pathname }) => {
  const diff = (a, b) => -1 * (a.beginsAt - b.beginsAt);
  const eventsList = R.sort(diff, events);

  return (
    <Box>
      {events && eventsList.map((event) =>
        <Event
          key={event.key}
          event={event}
          pathname={pathname}
        />
       )
      }
    </Box>
  );
};

EventList.propTypes = {
  events: React.PropTypes.array,
  pathname: React.PropTypes.string,
};

EventList = firebase((database, props) => {
  const timeThresh = moment().subtract(17, 'days').valueOf();
  const queuesRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [queuesRef, 'on', 'value', props.getAllEvents],
  ];
})(EventList);

EventList = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(EventList);

export default connect((state: State, props) => {
  return {
    events: state.events.eventList,
  };
}, { getAllEvents, listVenues })(EventList);
