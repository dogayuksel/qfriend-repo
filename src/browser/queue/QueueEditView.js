/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import moment from 'moment';
import R from 'ramda';
import { Button, Text, Box } from '../app/components';
import { connect } from 'react-redux';
import { checkAllQueues, deleteQueueEntry } from '../../common/queues/actions';
import { firebase } from '../../common/lib/redux-firebase';

class QueueData extends React.Component {

  static propTypes = {
    queue: React.PropTypes.array,
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

    let lastEntry = {};
    let updateTime = 0;

    if (queue && queue.length > 0) {
      lastEntry = queue[queue.length-1];
      const timeNow = new Date().getTime();
      updateTime = ((timeNow - lastEntry.loggedAt) / 60000) | 0;
    }

    return (
      <Box>
        {!queue || queue.length === 0 ?
         <Text>No queues yet.</Text>
         :
         <Box display="flex" alignItems="center">
           <Box display="flex" flexDirection="column">
             <Text>{lastEntry.value}</Text>
             <Text>{this.genText(updateTime)}</Text>
             <Text>"mins"</Text>
           </Box>
           <Button
             danger
             marginLeft={1}
             disabled={disabled}
             onClick={() => deleteQueueEntry(lastEntry.key)}
           >
             <Text>Delete</Text>
           </Button>
         </Box>
        }
      </Box>
    );
  }
}

QueueData = firebase((database, props) => {
  const timeThresh = moment().subtract(12, 'hours').valueOf();
  const queuesRef = database.child('queues')
                            .orderByChild('loggedAt')
                            .startAt(timeThresh);
  return [
    [queuesRef, 'on', 'value', props.checkAllQueues],
  ];
})(QueueData);

export default connect((state: State, props) => {
  return {
    queue: state.queues.queueMap[`${props.venueKey}`],
  };
}, { checkAllQueues, deleteQueueEntry })(QueueData);
