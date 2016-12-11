/* @flow */
import './EventPage.css';
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
         Space,
         Flex,
         Box,
         Select,
         View } from '../app/components';

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
      <View
        m={1}
        itemScope
        itemType="http://schema.org/MusicEvent"
      >
        {event && venue ?
         <View className="page">
           <View
             itemProp="location"
             itemScope
             itemType="http://schema.org/MusicVenue"
           >
             <meta itemProp="name" content={venue.title} />
             <meta itemProp="address" content={venue.address} />
             <meta itemProp="url" content={venue.facebookURL} />
             <meta itemProp="description" content={venue.description} />
           </View>
           <Image
             m={1} mt={3}
             itemProp="image"
             src={event.photoURL}
             style={styles.image}
           />
           <View mt={3}>
             <Flex align="center">
               <Heading
                 style={styles.title}
                 level={1}
                 size={1}
                 itemProp="name"
               >
                 {event.name}
               </Heading>
               <FacebookProvider appID="1000515043403983">
                 <Share href={`http://qfriend.co/event/${event.key}`}>
                   <Button
                     pill
                     ml={2}
                     type="button"
                     theme="secondary"
                   >
                     Share
                   </Button>
                 </Share>
               </FacebookProvider>
             </Flex>
             <Text
               mt={1}
               small
               itemProp="startDate"
               content={eventStartDate}
             >
               {eventStartDate}
             </Text>
             <Text
               mb={2}
               small
             >
               <Link
                 target="_blank"
                 to={`http://maps.google.com/?q=${venue.address}`}
                 theme="secondary"
                 onClick={() => reportEventClick('useMapsLink')}
               >
                 {venue.address}
               </Link>
             </Text>
             <Venue venue={venue} event={null}/>
             {event.facebookEventURL ?
              <Link
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
             {event.facebookEventURL && event.residentAdvisorURL &&
              <View mt={1}/>
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
           </View>
         </View>
         :
         <Heading size={3} mt={4}>
           Can't find that event
         </Heading>
        }
        <Link to="/">
          <Button mt={4} theme="primary">
            Back
          </Button>
        </Link>
      </View>
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

export default connect((state, props) => {
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
