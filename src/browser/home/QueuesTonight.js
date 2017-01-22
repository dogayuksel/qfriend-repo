/* @flow */
import type { State } from '../../common/types';
import Venue from '../venues/Venue';
import Event from '../events/Event';
import React from 'react';
import moment from 'moment';
import R from 'ramda';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { getAllEvents } from '../../common/events/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Loading,
         Heading,
         Text,
         Title,
         Box } from '../app/components';

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
  const diff = (a, b) => {
    const venueAVal = R.takeLast(1, R.map(R.prop('value'), a['data']))[0];
    const venueBVal = R.takeLast(1, R.map(R.prop('value'), b['data']))[0];
    if ( venueAVal === venueBVal ) {
      const venueALog = R.takeLast(1, R.map(R.prop('loggedAt'), a['data']))[0];
      const venueBLog = R.takeLast(1, R.map(R.prop('loggedAt'), b['data']))[0];
      return -1 * (venueALog - venueBLog);
    }
    return -1 * ( venueAVal - venueBVal );
  };
  const convert = R.compose(R.map(R.zipObj(['venueKey', 'data'])), R.toPairs);
  let queueList = R.sort(diff, convert(queues));

  var earlyCheck = (a, b) => {
    return (a.beginsAt - b.beginsAt)
  };
  const sortedEvents = R.sort(earlyCheck, events);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
  };

  return (
    <Box>
      {!loaded ?
       <Loading />
       : !queueList || queueList.length === 0 ?
       <Box
         marginHorizontal={2}
       >
         {events.length > 0 &&
          <Box marginBottom={3}>
            <Slider {...settings}>
              {R.map((event) => {
                 return (
                   <div key={event.key}>
                     <Event key={event.key} event={event} />
                   </div>
                 );
               }, sortedEvents)
              }
            </Slider>
          </Box>
         }
       </Box>
       :
       R.map(item => {
         const venue = R.find(R.propEq('key', parseInt(item['venueKey'], 10)))(venues);
         const event = R.find(R.propEq('venueKey', item['venueKey']))(events);
         return (
           <Venue key={item['venueKey']} venue={venue} event={event} />
         );
       })(queueList)
      }
    </Box>
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

export default connect((state: State) => ({
  events: state.events.eventList,
  venues: state.venues.venueList,
  queues: state.queues.queueMap,
  loaded: state.venues.venuesLoaded,
}), { listVenues, checkAllQueues, getAllEvents })(QueuesTonight);
