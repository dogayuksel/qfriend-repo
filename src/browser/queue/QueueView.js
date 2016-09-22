/* @flow */
import React from 'react';
import { Stat, Text, View } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues } from '../../common/queues/actions';

class QueueView extends React.Component {

  static propTypes = {
    queue: React.PropTypes.object,
    venueKey: React.PropTypes.number.isRequired,
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
           label={this.genText(updateTime)}
           unit="mins"
         />
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    queue: state.queues.queueMap.get(`${props.venueKey}`),
  };
}, { checkQueues })(QueueView);
