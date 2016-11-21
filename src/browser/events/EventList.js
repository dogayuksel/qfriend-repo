/* @flow */
import React from 'react';
import Event from './Event';
import moment from 'moment';
import { connect } from 'react-redux';
import { getAllEvents } from '../../common/events/actions';
import { listVenues } from '../../common/venues/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Flex,
         Heading,
         Loading,
         Text,
         View } from '../app/components';

const styles = {
  eventList: {
    width: '80vw',
    maxWidth: '950px',
    margin: 'auto',
  },
};

let EventList = ({ events }) => {
  const eventsList = events.toSeq().sortBy((value) => {
    return -value.beginsAt;
  }).toList();
  return (
    <Flex align="center" wrap style={styles.eventList}>
      {events && eventsList.map((event) =>
        <Event key={event.key} event={event} />
       )
      }
    </Flex>
  );
};

EventList.propTypes = {
  events: React.PropTypes.object,
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

export default connect((state, props) => {
  return {
    events: state.events.eventList,
  };
}, { getAllEvents, listVenues })(EventList);
