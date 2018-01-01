import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import moment from 'moment';

import {
  Title,
  Box,
  Paragraph,
  Link,
  Heading,
  PageHeader,
} from '../app/components';
import type { State, Venue, Event } from '../../common/types';
import { firebase } from '../../common/lib/redux-firebase';
import { listVenues } from '../../common/venues/actions';
import { getAllEvents } from '../../common/events/actions';

import EventBlock from '../events/Event';
import VenueLinks from './VenuesLinks';

type Props = {
  params: {
    shortName: string,
  },
  venues: Array<Venue>,
  events: Array<Event>,
  listVenues: typeof listVenues,
};

let VenuePage = (props: Props) => {
  const { params: { shortName }, venues, events } = props;
  const venue = R.find(R.propEq('shortName', shortName))(venues);

  const timeNow = moment().subtract(7, 'hours').valueOf();

  const venueEvents = R.pipe(
    R.filter((event) => parseInt(event.venueKey, 10) === venue.key),
    R.sortBy(R.prop('beginsAt')),
  )(events);

  const upcomingVenueEvents = R.filter((event) =>
    event.beginsAt > timeNow)(venueEvents);
  const pastVenueEvents = R.reverse(R.filter((event) =>
    event.beginsAt < timeNow)(venueEvents));

  return (
    <Box>
      {venue ?
       <Box>
         <PageHeader
           heading={venue.title}
           description={venue.address}
         />
         <Title message={venue.title} />
         <Box margin={2}>
           <Paragraph margin={1}>
             {venue.description}
           </Paragraph>
           {upcomingVenueEvents.length > 0 &&
            <Box>
              <Heading size={1} margin={1}>
                Upcoming Events
              </Heading>
              <Box display="flex" flexWrap="wrap">
                {upcomingVenueEvents.map((event) =>
                  <EventBlock
                    pathname={'/venues'}
                    event={event}
                  />
                )}
              </Box>
            </Box>
           }
           {pastVenueEvents.length > 0 &&
            <Box>
              <Heading size={1} margin={1}>
                Past Events
              </Heading>
              <Box display="flex" flexWrap="wrap">
                {pastVenueEvents.map((event) =>
                  <EventBlock
                    pathname={'/venues'}
                    event={event}
                  />
                )}
              </Box>
            </Box>
           }
         </Box>
       </Box>
       :
       <Link
         to="/venues"
         margin={3}
         >
         Couldn&apos;t find that venue, go back.
       </Link>
      }
      <VenueLinks venues={venues} />
    </Box>
  );
};

VenuePage = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(VenuePage);

VenuePage = firebase((database, props) => {
  const timeThresh = moment().subtract(30, 'days').valueOf();
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(VenuePage);

export default connect((state: State) => ({
  venues: state.venues.venueList,
  events: state.events.eventList,
}), { listVenues, getAllEvents })(VenuePage);
