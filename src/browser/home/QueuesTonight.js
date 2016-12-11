/* @flow */
import Venue from '../venues/Venue';
import Event from '../events/Event';
import React from 'react';
import moment from 'moment';
import R from 'ramda';
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
  subTitles: {
    margin: 'auto',
    maxWidth: '800px',
  },
};

let QueuesTonight = ({ loaded, venues, queues, events }) => {
  var isFeatured = R.prop('isFeatured');
  const featuredEventsList = R.filter(isFeatured, events);
  const otherEventsList = R.reject(isFeatured, events);

  return (
    <View>
      {!loaded ?
      <Loading />
       : !queues || Object.keys(queues).length === 0 ?
       <Block>
         {featuredEventsList.length > 0 &&
          <Block>
            <Heading
              style={styles.subTitles}
              level={2} mb={2} pl={3} pr={1}
            >
              Featured Events
            </Heading>
            <Flex align='baseline' wrap style={styles.eventList}>
           {R.map((event) => {
              return (
               <Event key={event.key} event={event} />
             );
            }, featuredEventsList)
           }
            </Flex>
           </Block>
         }
         {otherEventsList.length > 0 &&
          <Block>
            <Heading
              style={styles.subTitles}
              mt={4}
              level={2}
              mb={2} pl={3} pr={1}
            >
              Other Events
            </Heading>
            <Flex align='baseline' wrap style={styles.eventList}>
              {R.map((event) => {
                 return (
                   <Event key={event.key} event={event} />
                 );
               }, otherEventsList)
              }
            </Flex>
           </Block>
         }
        </Block>
    :
   Object.keys(queues).map(item => {
     const venueKey = R.takeLast(1, R.map(R.prop('venueKey'), queues[item]));
     const venue = R.find(R.propEq('key', venueKey[0]))(venues);
     const event = R.find(R.propEq('venueKey', venueKey.toString()))(events);
     return (
       <Venue key={venueKey[0]} venue={venue} event={event} />
     );
   })
      }
    </View>
  );
};

QueuesTonight.propTypes = {
  events: React.PropTypes.array,
  venues: React.PropTypes.array,
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
  const queuesRef = database.child('queues')
                               .orderByChild('loggedAt')
                               .startAt(timeThresh);
  return [
    [queuesRef, 'on', 'value', props.checkAllQueues],
  ];
})(QueuesTonight);

QueuesTonight = firebase((database, props) => {
  const timeThresh = moment().subtract(12, 'hours').valueOf();
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(QueuesTonight);

export default connect(state => ({
  events: state.events.eventList,
  venues: state.venues.venueList,
  queues: state.queues.queueMap,
  loaded: state.venues.venuesLoaded,
}), { listVenues, checkAllQueues, getAllEvents })(QueuesTonight);
