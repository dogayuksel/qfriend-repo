/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import Venue from '../venues/Venue';
import moment from 'moment';
import FacebookProvider, { Share } from 'react-facebook';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';
import { getAllEvents } from '../../common/events/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { reportEventClick } from '../../common/events/actions';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Button,
         Link,
         Image,
         Input,
         PageHeader,
         Paragraph,
         Box } from '../app/components';

const styles = {
  image: {
    maxWidth: '80vw',
    maxHeight: '50vh',
  },
  title: {
    maxWidth: '550px',
  },
}

class EventPage extends React.Component {

  static propTypes = {
    event: React.PropTypes.object,
  };

  render() {
    const { isAdmin, venues, event, reportEventClick } = this.props;
    const venue = event && venues.find(value => `${value.key}` === event.venueKey);
    const eventStartDate = event && moment(event.beginsAt).format('LLLL');

    return (
      <Box
        itemScope
        itemType="http://schema.org/MusicEvent"
      >
        {(event && venue) &&
         <PageHeader
           description={event.name}
           heading={venue.title}
         >
           <meta itemProp="name" content={event.name} />
         </PageHeader>
        }
      {event && venue ?
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
         <Paragraph>
           {event.description}
         </Paragraph>
         <Box
           margin={1}
           itemProp="image"
           backgroundImage={event.photoURL}
           backgroundSize='contain'
           backgroundRepeat='no-repeat'
           maxWidth={25}
           height={15}
         >
         </Box>
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
             marginBottom={2}
           >
             <Link
               target="_blank"
               to={`http://maps.google.com/?q=${venue.address}`}
               onClick={() => reportEventClick('useMapsLink')}
             >
               {venue.address}
             </Link>
           </Paragraph>
           <Paragraph>
             <FacebookProvider appID="1000515043403983">
               <Share href={`http://qfriend.co/event/${event.key}`}>
                 <Button
                   success
                 >
                   Share Event On Facebook
                 </Button>
               </Share>
             </FacebookProvider>
           </Paragraph>
           <Paragraph>
             {event.facebookEventURL ?
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
              :
              null
             }
        {event.residentAdvisorURL ?
         <Link
           target="_blank"
           onClick={() => reportEventClick('residentAdvisor')}
           to={event.residentAdvisorURL}
           itemProp="url"
           theme="secondary"
         >
           resident advisor
         </Link>
         :
         null
        }
           </Paragraph>
         </Box>
       </Box>
       :
       <Heading>
         Can't find that event
       </Heading>
      }
        <Link margin={1} to="/">
          <Button primary>
            Back
          </Button>
        </Link>
      </Box>
    );
  }
}

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
  const timeThresh = moment().subtract(12, 'hours').valueOf();
  const eventsRef = database.child('events')
                            .orderByChild('beginsAt')
                            .startAt(timeThresh);
  return [
    [eventsRef, 'on', 'value', props.getAllEvents],
  ];
})(EventPage);

export default connect((state: State, props) => {
  const { eventId } = props.params;
  return {
    event: state.events.eventList.find(value => value.key === eventId),
    isAdmin: state.admin.isAdmin,
    venues: state.venues.venueList,
  };
}, { reportEventClick,
     listVenues,
     checkAllQueues,
     getAllEvents })(EventPage);
