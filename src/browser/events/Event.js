/* @flow */
import React from 'react';
import moment from 'moment';
import { deleteEvent } from '../../common/events/actions';
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
         View } from '../app/components';

type State = {
  countdown: ?String,
};

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

    return (
      <Card
        ml={1}
        rounded
        width={242}
      >
        <CardImage src={event.photoURL}/>
        <Heading
          level={2}
          size={3}
        >
          {event.name}
        </Heading>
        <Text>
          {venue && venue.title}
        </Text>
        <Text small>{countdown}</Text>
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
}, { deleteEvent })(Event);
