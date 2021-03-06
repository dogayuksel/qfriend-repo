/* @flow */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import FacebookProvider, { Share } from 'react-facebook';

import type { State, Event, Venue } from '../../common/types';
import QueueView from '../queue/QueueView';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { firebase } from '../../common/lib/redux-firebase';
import {
  reportEventClick,
  getOneEvent,
} from '../../common/events/actions';
import {
  Title,
  Text,
  Heading,
  Button,
  Link,
  PageHeader,
  Paragraph,
  Box,
} from '../app/components';

type Props = {
  venues: [Venue],
  event: Event,
  isAdmin: boolean,
  reportEventClick: (eventName: string) => void,
}

let EventPage = (props: Props) => {
  const { venues, event, reportEventClick, isAdmin } = props;
  const venue = event && venues.find(value => `${value.key}` === event.venueKey);
  const eventStartDate = event && moment(event.beginsAt).format('LLLL');

  return (
    <Box
      itemScope
      itemType="http://schema.org/MusicEvent"
    >
      {(event && venue) &&
       <Box>
         <meta itemProp="name" content={event.name} />
         <Title message={event.name} />
         <PageHeader
           description={event.name}
           heading={venue.title}
         />
       </Box>
      }
      {(event && venue) ?
       <Box margin={1}>
         <div
           itemProp="location"
           itemScope
           itemType="http://schema.org/MusicVenue"
         >
           <meta itemProp="name" content={venue.title} />
           <meta itemProp="address" content={venue.address} />
           <meta itemProp="url" content={venue.facebookURL} />
           <meta itemProp="description" content={venue.description} />
         </div>
         {isAdmin &&
          <Link
            target="_blank"
            to={`/editevents/event/${event.key}`}
          >
            edit event
          </Link>
         }
         <Box
           margin={1}
           itemProp="image"
           backgroundImage={event.photoURL}
           backgroundSize="contain"
           backgroundRepeat="no-repeat"
           maxWidth={25}
           height={15}
         />
         {event.description &&
          event.description.split('\n').map((part, index) => (
            <Paragraph marginLeft={1} color="white" key={index}>
              {part}
            </Paragraph>
          ))
         }
         <Box
           marginVertical={2}
           marginHorizontal={1}
         >
           <Paragraph
             marginTop={1}
             itemProp="startDate"
             content={eventStartDate}
           >
             {eventStartDate}
           </Paragraph>
           <Paragraph
             marginBottom={1}
           >
             <Link
               target="_blank"
               to={`http://maps.google.com/?q=${venue.address}`}
               onClick={() => reportEventClick('useMapsLink')}
             >
               {venue.address}
             </Link>
           </Paragraph>
           <Box maxWidth={10} marginBottom={2}>
             <Text marginLeft={1}>Estimated waiting time:</Text>
             <QueueView venueKey={parseInt(event.venueKey, 10)} />
           </Box>
           <Paragraph>
             <FacebookProvider appID="1000515043403983">
               <Share href={`http://qfriend.co/event/${event.key}`}>
                 <Button success size={-1}>
                   <Text color="black" bold size={-1}>
                     Share Event on Facebook
                   </Text>
                 </Button>
               </Share>
             </FacebookProvider>
           </Paragraph>
           <Paragraph>
             {event.facebookEventURL &&
              <Link
                marginRight={1}
                target="_blank"
                onClick={() => reportEventClick('facebook')}
                to={event.facebookEventURL}
                itemProp="url"
                theme="secondary"
              >
                facebook
              </Link>
             }
             {event.residentAdvisorURL &&
              <Link
                target="_blank"
                onClick={() => reportEventClick('residentAdvisor')}
                to={event.residentAdvisorURL}
                itemProp="url"
                theme="secondary"
              >
                resident advisor
              </Link>
             }
           </Paragraph>
         </Box>
       </Box>
       :
       <Heading margin={1}>
         Can&apos;t find that event
       </Heading>
      }
      <Link margin={2} to="/">
        <Button primary>
          Back
        </Button>
      </Link>
    </Box>
  );
};


EventPage = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(EventPage);

EventPage = firebase((database, props) => {
  const timeThresh = moment().subtract(6, 'hours').valueOf();
  const queuesRef = database.child('queues')
                            .orderByChild('loggedAt')
                            .startAt(timeThresh);
  return [
    [queuesRef, 'on', 'value', props.checkAllQueues],
  ];
})(EventPage);

EventPage = firebase((database, props) => {
  const { eventId } = props.params;
  const eventsRef = database.child('events')
                            .child(eventId);
  return [
    [eventsRef, 'on', 'value', props.getOneEvent],
  ];
})(EventPage);

export default connect((state: State, props) => {
  const { eventId } = props.params;
  return {
    event: state.events.eventList &&
           state.events.eventList.find(
             value => value.key === eventId),
    venues: state.venues.venueList,
    isAdmin: state.admin.isAdmin,
  };
}, {
  reportEventClick,
  listVenues,
  checkAllQueues,
  getOneEvent,
})(EventPage);
