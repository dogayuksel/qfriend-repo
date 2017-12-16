/* @flow */
import React from 'react';
import moment from 'moment';
import R from 'ramda';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import './styles.css';
import Event from '../events/Event';
import type { State } from '../../common/types';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { getAllEvents } from '../../common/events/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Loading,
         Text,
         Box } from '../app/components';

let QueuesTonight = ({ loaded, events }) => {
  const earlyCheck = (a, b) => a.beginsAt - b.beginsAt;
  const sortedEvents = R.sort(earlyCheck, events);
  const eventMap = R.groupBy((event) => moment(event.beginsAt).format('MMMM Do-dddd'), sortedEvents);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          speed: 600,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 700,
        settings: {
          speed: 700,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 490,
        settings: {
          speed: 800,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box>
      {!loaded ?
       <Loading />
       :
       <Box marginHorizontal={2}>
         {Object.keys(eventMap).map((date, index) =>
           <Box key={index} marginTop={1} marginBottom={3}>
             <Box marginLeft={1} display="flex" flexDirection="column">
               <Text size={2} marginBottom={-0.5}>
                 {date.split('-')[1]}
               </Text>
               <Text bold size={-1} marginLeft={0.05}>
                 {date.split('-')[0]}
            </Text>
             </Box>
             <Slider {...settings}>
               {eventMap[date].map((event) => (
                 <div key={event.key}>
                   <Event key={event.key} event={event} />
                 </div>
               ))
               }
             </Slider>
           </Box>
         )
         };
       </Box>
      }
    </Box>
  );
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
  loaded: state.venues.venuesLoaded,
  queues: state.queues.queueMap,
}), { listVenues, checkAllQueues, getAllEvents })(QueuesTonight);
