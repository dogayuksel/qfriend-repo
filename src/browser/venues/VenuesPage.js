import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  Box,
  Heading,
  Link,
  PageHeader,
} from '../app/components';
import type { State, Venue, Event } from '../../common/types';
import { listVenues } from '../../common/venues/actions';
import { getAllEvents } from '../../common/events/actions';
import { firebase } from '../../common/lib/redux-firebase';
import EventBlock from '../events/Event';

type Props = {
  venues: Array<Venue>,
  events: Array<Event>,
  listVenues: typeof listVenues,
  getAllEvents: typeof getAllEvents,
}

const VenueBlock = ({ venue, events }) => (
  <Box>
    {events.length > 0 ?
     <Box marginBottom={3}>
       <Heading size={2} marginLeft={1.5} marginBottom={-0.5}>
         {venue.title}
       </Heading>
       <Link
         marginLeft={1.5}
         to={`/venue/${venue.shortName}`}
         size={-1}
       >
         read more
       </Link>
       <Heading marginLeft={1.5} marginTop={1} marginBottom={0}>
         Upcoming events:
       </Heading>
       <Box display="flex" flexWrap="wrap">
         {events.map((event) => (
           <Box marginBottom={2}>
             <EventBlock
               pathname={'/venues'}
               key={event.key}
               event={event}
             />
           </Box>
         ))}
           </Box>
       </Box>
     :
     null
    }
     </Box>
);

let VenuesPage = (props: Props) => {
  const { venues, events } = props;
  const venueList = R.reject((venue) => venue.active === 0, venues);
  return (
    <Box>
      <PageHeader
        description={'No queueing! Go clubbing!'}
        heading={'Venues'}
      />
      <Box
        display="flex"
        flexDirection="column"
        margin={1}
      >
        {venueList.map((venue) => {
          const venueEvents = R.pipe(
            R.filter((event) => parseInt(event.venueKey, 10) === venue.key),
            R.sortBy(R.prop('beginsAt')),
          )(events);
          return (
            <VenueBlock
              key={venue.key}
              venue={venue}
              events={venueEvents}
            />
          );
        })}
      </Box>
    </Box>
  );
};

VenuesPage = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(VenuesPage);

VenuesPage = firebase((database, props) => {
  const timeThresh = moment().subtract(12, 'hours').valueOf();
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(VenuesPage);

export default connect((state: State) => ({
  events: state.events.eventList,
  venues: state.venues.venueList,
}), { listVenues, getAllEvents })(VenuesPage);
