/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import moment from 'moment';
import QueueView from '../queue/QueueView';
import { deleteEvent, reportEventClick } from '../../common/events/actions';
import { connect } from 'react-redux';
import { Text,
         Heading,
         Image,
         Link,
         Button,
         Paragraph,
         Box } from '../app/components';

type timerState = {
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
    pathname: React.PropTypes.string,
  };

  state: timerState = {
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
        {event.isFeatured ?
         <Box
           width={8}
           height={8}
           border={true}
           borderColor="primary"
           borderWidth="4"
           display="flex"
           flexDirection="column-reverse"
           backgroundImage={event.photoURL}
           backgroundSize="cover"
           backgroundPosition="center center"
           paddingHorizontal={1}
           paddingVertical={1}
         >
           {/ago/.test(countdown) ?
            <QueueView venueKey={parseInt(event.venueKey, 10)} />
            :
            null
           }
         </Box>
         :
         <Box
           width={8}
           height={8}
           display="flex"
           flexDirection="column-reverse"
           backgroundImage={event.photoURL}
           backgroundSize="cover"
           backgroundPosition="center center"
           paddingHorizontal={1}
           paddingVertical={1}
         >
           {/ago/.test(countdown) ?
            <QueueView venueKey={parseInt(event.venueKey, 10)} />
            :
            null
           }
         </Box>
        }
        <Link
          onClick={() => reportEventClick(event.key)}
          to={`/event/${event.key}`}
        >
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
          {(/ago/.test(countdown) || /hours/.test(countdown)) &&
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
             <Button
               warning
             >
               Edit
             </Button
             >
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
}, { deleteEvent, reportEventClick })(Event);
