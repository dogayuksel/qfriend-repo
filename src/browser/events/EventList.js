/* @flow */
import React from 'react';
import Event from './Event';
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
  return (
    <Flex align="center" wrap style={styles.eventList}>
      {events && events.map((event) =>
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
  const queuesRef = database.child('events');
  return [
    [queuesRef, 'on', 'value', props.getAllEvents],
  ];
})(EventList);

EventList = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'once', 'value', props.listVenues],
  ];
})(EventList);

export default connect((state, props) => {
  return {
    events: state.events.eventList,
  };
}, { getAllEvents, listVenues })(EventList);
