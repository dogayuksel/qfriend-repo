/* @flow */
import React from 'react';
import { Button, Stat, Text, View, Flex } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues, deleteQueueEntry } from '../../common/queues/actions';
import { firebase } from '../../common/lib/redux-firebase';

class QueueData extends React.Component {

  static propTypes = {
    queue: React.PropTypes.object,
    disabled: React.PropTypes.bool.isRequired,
    venueKey: React.PropTypes.number.isRequired,
    deleteQueueEntry: React.PropTypes.func.isRequired,
  };

  genText = (updateTime) => {
    switch (updateTime) {
      case 0: return 'updated just now';
      case 1: return 'updated a minute ago';
      default: {
        if (updateTime >= 120) {
          return `updated ${updateTime / 60 | 0} hours ago`;
        } else if (updateTime >= 60) {
          return 'updated an hour ago';
        }
        return `updated ${updateTime} mins ago`;
      }
    }
  };

  render() {
    const { queue, disabled, deleteQueueEntry } = this.props;
    const lastEntry = queue && queue.last();
    const timeNow = new Date().getTime();
    const updateTime = lastEntry &&
                       ((timeNow - lastEntry.loggedAt) / 60000) | 0;

    return (
      <View>
        {!queue ?
         <Text>No queues yet.</Text>
         :
         <Flex column align="center">
           <Stat
             mb={1} pl={1}
             value={lastEntry.value}
             label={this.genText(updateTime)}
             unit="mins"
           />
           <Button
             pill mb={2}
             theme="error"
             type="button"
             disabled={disabled}
             onClick={() => deleteQueueEntry(lastEntry.key)}
           >
             <Text small>delete</Text>
           </Button>
         </Flex>
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
    queue: state.queues.queueMap.get(`${props.venueKey}`),
  };
}, { checkQueues, deleteQueueEntry })(QueueData);
