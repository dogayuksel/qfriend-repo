/* @flow */
import Venue from '../venues/Venue';
import Event from '../events/Event';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { getAllEvents } from '../../common/events/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Loading,
         Block,
         Heading,
         Text,
         Flex,
         View } from '../app/components';

const styles = {
  eventList: {
    width: '80vw',
    maxWidth: '780px',
    margin: 'auto',
  },
};

let QueuesTonight = ({ loaded, venues, queues, events }) => {
  const displayList = queues.toSeq().sortBy(
    (queue) => queue.last(),
    (valueA, valueB) => {
      if (valueA.get('value') === valueB.get('value')) {
        if (valueA.loggedAt > valueB.loggedAt) return -1;
        return 1;
      }
      return valueB.get('value') - valueA.get('value');
    }).toList();
  const eventsList = events
    .toSeq()
    .sortBy(value => value.beginsAt)
    .sortBy(value => -value.isFeatured)
    .toList();

  return (
    <View>
      {!loaded ?
      <Loading />
    : !displayList || displayList.size === 0 ?
    <Flex align='baseline' wrap style={styles.eventList}>
      {eventsList.map((event) =>
      <Event key={event.key} event={event} />
      )}
    </Flex>
    :
    displayList.map(item => {
      const venueKey = item.first().get('venueKey');
      const venue = venues.find(venue => venue.key === venueKey);
      return (
        <Venue key={venueKey} venue={venue} />
      );
    })
      }
    </View>
  );
};

QueuesTonight.propTypes = {
  venues: React.PropTypes.object,
  queues: React.PropTypes.object,
  loaded: React.PropTypes.bool.isRequired,
};

QueuesTonight = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(QueuesTonight);

QueuesTonight = firebase((database, props) => {
  const timeThresh = moment().subtract(6, 'hours').valueOf();
  const locationsRef = database.child('queues')
                               .orderByChild('loggedAt')
                               .startAt(timeThresh);
  return [
    [locationsRef, 'on', 'value', props.checkAllQueues],
  ];
})(QueuesTonight);

QueuesTonight = firebase((database, props) => {
  const timeThresh = moment().subtract(1, 'day').valueOf();
  const queuesRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [queuesRef, 'on', 'value', props.getAllEvents],
  ];
})(QueuesTonight);

export default connect(state => ({
  events: state.events.eventList,
  venues: state.venues.venueList,
  queues: state.queues.queueMap,
  loaded: state.venues.venuesLoaded,
}), { listVenues, checkAllQueues, getAllEvents })(QueuesTonight);
