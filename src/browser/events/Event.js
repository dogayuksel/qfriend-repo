/* @flow */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import QueueView from '../queue/QueueView';
import type { State, Event, Venue } from '../../common/types';
import { deleteEvent,
         reportEventClick } from '../../common/events/actions';
import { Text,
         Link,
         Button,
         Paragraph,
         Box } from '../app/components';

type ComponentState = {
  countdown: string,
}

type Props = {
  event: Event,
  isAdmin: boolean,
  venue: Venue,
  pathname: string,
  reportEventClick: typeof reportEventClick,
  deleteEvent: typeof deleteEvent,
}

class EventBlock extends React.Component<Props, ComponentState> {

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
      <Box
        paddingHorizontal={0.5}
        itemScope
        itemType="http://schema.org/MusicEvent"
      >
        {venue &&
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
        }
        <Link
          onClick={() => reportEventClick(event.key)}
          to={`/event/${event.key}`}
        >
          <Box
            width={8}
            height={8}
            border={event.isFeatured && true}
            borderColor="primary"
            borderWidth="4"
            display="flex"
            flexDirection="column-reverse"
            backgroundImage={event.photoURL}
            backgroundSize="cover"
            backgroundPosition="center center"
            paddingHorizontal={1}
            paddingVertical={1}
            marginVertical={0.5}
          >
            {/ago/.test(countdown) ?
             <QueueView venueKey={parseInt(event.venueKey, 10)} />
             :
             null
            }
          </Box>

          <Paragraph
            itemProp="name"
            maxWidth={8}
          >
            {event.name}
          </Paragraph>
        </Link>
        <Box display="flex" flexDirection="column">
          <Text>
            {venue && venue.title}
          </Text>
          {(/ago/.test(countdown) ||
            /hours/.test(countdown) ||
            /hour/.test(countdown)) &&
           <Text
             size={-1}
             itemProp="startDate"
             content={eventStartDate}
             color={/ago/.test(countdown) ? 'warning' : 'white'}
           >
             {countdown}
           </Text>
          }
        </Box>
        {isAdmin && pathname === '/editevents' &&
         <Box marginBottom={1}>
           <Link
             marginRight={0.5}
             to={`${pathname}/event/${event.key}`}
           >
             <Button warning>
               Edit
             </Button>
           </Link>
           <Button
             danger
             onClick={() => this.props.deleteEvent(event.key)}
           >
             Delete
           </Button>
         </Box>
        }
      </Box>
    );
  }
}

export default connect((state: State, props) => {
  const { venueKey } = props.event;
  return {
    isAdmin: state.admin.isAdmin,
    venue: (state.venues.venueList &&
            state.venues.venueList.find(value => `${value.key}` === venueKey)),
  };
}, { deleteEvent, reportEventClick })(EventBlock);
