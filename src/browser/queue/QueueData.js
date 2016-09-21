/* @flow */
import React from 'react';
import { Stat, Text, View } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues } from '../../common/queues/actions';
import { firebase } from '../../common/lib/redux-firebase';

class QueueData extends React.Component {

  static propTypes = {
    queue: React.PropTypes.object,
    venueKey: React.PropTypes.number.isRequired,
  };

  render() {
    const { queue } = this.props;
    const lastEntry = queue && queue.last();
    const timeNow = new Date().getTime();
    const updateTime = lastEntry &&
                       ((timeNow - lastEntry.loggedAt) / 60000) | 0;

    return (
      <View>
      {!queue ?
        <Text>No queues yet.</Text>
      :
        <Stat
          value={lastEntry.value}
          label={`${updateTime} mins ago`}
          unit="mins"
        />
      }
      </View>
    );
  }
}

QueueData = firebase((database, props) => {
  const venueKey = props.venueKey;
  const queuesRef = database.child('queues')
                            .orderByChild('venueKey')
                            .equalTo(venueKey);
  return [
    [queuesRef, 'on', 'value', props.checkQueues],
  ];
})(QueueData);

export default connect((state, props) => {
  return {
    queue: state.queues.queue.get(`${props.venueKey}`),
  };
}, { checkQueues })(QueueData);










