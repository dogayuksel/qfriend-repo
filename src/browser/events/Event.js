/* @flow */
import React from 'react';
import moment from 'moment';
import { deleteEvent, reportEventClick } from '../../common/events/actions';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Image,
         Card,
         CardImage,
         Link,
         Space,
         Button,
         Flex,
         Box,
         View } from '../app/components';

type State = {
  countdown: ?String,
};

const styles = {
  imageContainer: {
    maxHeight: 160,
    overflow: 'hidden',
  }
}

class Event extends React.Component {

  static propTypes = {
    event: React.PropTypes.object,
  };

  state: State = {
    countdown: null,
  };

  componentWillMount = () => {
    const { beginsAt } = this.props.event;
    const hoursLeft = moment(beginsAt).fromNow();
    this.setState({ countdown: hoursLeft });
    /* window.setInterval(() => {
     *   this.setTimerValue(this.props.event);
     * }, 1000 * 10);*/
  }

  render() {
    const { pathname, event, venue, isAdmin } = this.props;
    const { countdown } = this.state;
    const eventStartDate = moment(event.beginsAt).format();
    const { reportEventClick } = this.props;

    return (
      <Card
        ml={1}
        rounded
        width={243}
        itemScope
        itemType="http://schema.org/MusicEvent"
      >
        {venue &&
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
        }
        <View style={styles.imageContainer}>
          <CardImage itemProp="image" src={event.photoURL} />
        </View>
        <Heading
          level={2}
          size={3}
          itemProp="name"
        >
          {event.name}
        </Heading>
        <Flex mr={1} justify='space-between' align='flex-end'>
          <Box>
            <Text>
              {venue && venue.title}
            </Text>
            <Text
              small
              itemProp="startDate"
              content={eventStartDate}
            >
              {countdown}
            </Text>
          </Box>
          <Flex>
            {event.facebookEventURL ?
             <Link
               onClick={() => reportEventClick('facebook')}
               to={event.facebookEventURL}
               itemProp="url"
               theme="secondary"
             >
               FB
             </Link>
             :
             null
            }
          {event.facebookEventURL && event.residentAdvisorURL ?
           <Space x={2} />
           :
           null
          }
          {event.residentAdvisorURL ?
           <Link
             onClick={() => reportEventClick('residentAdvisor')}
             to={event.residentAdvisorURL}
             itemProp="url"
             theme="secondary"
           >
             RA
           </Link>
           :
           null
          }
          </Flex>
        </Flex>
        {isAdmin && pathname === '/editevents' &&
         <View mt={1}>
           <Link to={`${pathname}/event/${event.key}`}>
             <Button theme="info">
               Edit
             </Button>
           </Link>
           <Button
             ml={1}
             theme="error"
             onClick={() => this.props.deleteEvent(event.key)}
           >
             Delete
           </Button>
         </View>
        }
      </Card>
    );
  }
}

export default connect((state, props) => {
  const { venueKey } = props.event;
  return {
    isAdmin: state.admin.isAdmin,
    pathname: state.app.location && state.app.location.pathname,
    venue: (state.venues.venueList &&
            state.venues.venueList.find(value => `${value.key}` === venueKey)),
  };
}, { deleteEvent, reportEventClick })(Event);
