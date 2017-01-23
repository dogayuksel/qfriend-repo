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
  const earlyCheck = (a, b) => a.beginsAt - b.beginsAt;
  const sortedEvents = R.sort(earlyCheck, events);
  const eventMap = {};
  const timeIt = (event) => {
    const eventDate = moment(event.beginsAt).format("MMMM Do");
    if (eventDate in eventMap) {
      eventMap[eventDate].push(event);
    } else {
      eventMap[eventDate] = [];
      eventMap[eventDate].push(event);
    }
  }
  const days = R.map(timeIt, sortedEvents);

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
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ],
  };

  return (
    <Box>
      {!loaded ?
       <Loading />
       :
       <Box
         marginHorizontal={2}
       >
         {Object.keys(eventMap) && Object.keys(eventMap).map((value, index) => {
            return(
              <Box
                key={index}
                marginTop={1}
                marginBottom={3}
              >
                <Text
                  size={2}
                  marginLeft={1}
                  marginBottom={1}
                >
                  {value}
                </Text>
                <Slider {...settings}>
                  {R.map((event) => {
                     return (
                       <div key={event.key}>
                         <Event key={event.key} event={event} />
                       </div>
                     );
                   }, eventMap[value])
                  }
                </Slider>
              </Box>
            );
          })
         }
       </Box>
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
