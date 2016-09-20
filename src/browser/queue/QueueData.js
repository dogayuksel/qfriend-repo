/* @flow */
import React from 'react';
import { Text, View } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues } from '../../common/queues/actions';
import { queryFirebase } from '../../common/lib/redux-firebase';

const styles = {
  data: {
    display: 'inline-block',
  },
};

class QueueData extends React.Component {

  static propTypes = {
    queue: React.PropTypes.object,
    venueKey: React.PropTypes.number.isRequired,
  };

  render() {
    const { queue } = this.props;
    const timeNow = new Date().getTime();

    return (
      <View>
      {!queue ?
       <Text>No queues yet.</Text>
     : queue.map(item => {
       console.log(item);
       return (
         <Text
         key={item.loggedAt}
         style={styles.data}
         >
         {item.value} ({((timeNow - item.loggedAt) / 60000) | 0 }
         mins ago)
         </Text>
       );
     })}
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
