/* @flow */
import React from 'react';
import { Stat, Text, View } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues } from '../../common/queues/actions';
import { queryFirebase } from '../../common/lib/redux-firebase';

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

QueueData = queryFirebase(QueueData, ({ venueKey, checkQueues }) => {
  return ({
    path: venueKey && 'queues/',
    params: [
      ['orderByChild', 'venueKey'],
      ['equalTo', venueKey],
    ],
    on: { value: checkQueues },
  });
}
);

export default connect((state, props) => {
  return {
    queue: state.queues.queue.get(`${props.venueKey}`),
  };
}, { checkQueues })(QueueData);
