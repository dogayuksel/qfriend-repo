/* @flow */
import Venue from '../venues/Venue';
import EventList from '../events/EventList';
import React from 'react';
import { connect } from 'react-redux';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Loading,
         Block,
         Heading,
         Text,
         View } from '../app/components';

let QueuesTonight = ({ loaded, venues, queues }) => {
  const displayList = queues.toSeq().sortBy(
    (queue) => queue.last(),
    (valueA, valueB) => {
      if (valueA.get('value') === valueB.get('value')) {
        if (valueA.loggedAt > valueB.loggedAt) return -1;
        return 1;
      }
      return valueB.get('value') - valueA.get('value');
    }).toList();
  /* console.log('display list', displayList);*/

  return (
    <View>
    {!loaded ?
     <Loading />
   : !displayList || displayList.size === 0 ?
     <EventList />
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
  const timeNow = new Date().getTime();
  const locationsRef = database.child('queues')
                               .orderByChild('loggedAt')
                               .startAt(timeNow - 21600000);
  return [
    [locationsRef, 'on', 'value', props.checkAllQueues],
  ];
})(QueuesTonight);

QueuesTonight = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(QueuesTonight);

QueuesTonight = firebase((database, props) => {
  const queuesRef = database.child('events');
  return [
    [queuesRef, 'once', 'value', props.getAllEvents],
  ];
})(QueuesTonight);

export default connect(state => ({
  venues: state.venues.venueList,
  queues: state.queues.queueMap,
  loaded: state.venues.venuesLoaded,
}), { listVenues, checkAllQueues })(QueuesTonight);
