/* @flow */
import React from 'react';
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
  timerValue: ?Object,
};

class Event extends React.Component {

  static propTypes = {
    event: React.PropTypes.object,
  };

  state: State = {
    timerValue: null,
  };

  countdown = (timerValue) => {
    if (timerValue > 24) {
      const days = timerValue / 24 | 0;
      return `${days} days`;
    } else {
      return `${timerValue} hours`;
    }
  }

  componentDidMount = () => {
    this.setTimerValue(this.props.event);
    /* window.setInterval(() => {
     *   this.setTimerValue(this.props.event);
     * }, 1000 * 10);*/
  }

  setTimerValue = (event) => {
    const hoursLeft = ((event.beginsAt - Date.now()) / 3600000) | 0;
    this.setState({ timerValue: hoursLeft });
  }

  render() {
    const { pathname, event, venue, isAdmin } = this.props;
    const { timerValue } = this.state;

    return (
      <Card
        ml={1}
        rounded
        width={226}
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
        <Text small>Starts in {this.countdown(timerValue)}</Text>
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
    pathname: state.app.location.pathname,
    venue: (state.venues.venueList &&
            state.venues.venueList.find(value => `${value.key}` === venueKey)),
  };
}, { deleteEvent })(Event);
