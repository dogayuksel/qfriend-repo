/* @flow */
import React from 'react';
import { Stat, Text, View, Flex } from '../app/components';
import { connect } from 'react-redux';
import { checkQueues } from '../../common/queues/actions';

const hourToMinute = 90;

class QueueView extends React.Component {

  static propTypes = {
    queue: React.PropTypes.object,
    venueKey: React.PropTypes.number.isRequired,
  };

  genUpdateText = (updateTime) => {
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

  genUnitText = (waitTime) => {
    switch (waitTime) {
      case 0: return 'no queues';
      case 1: return 'min';
      default: {
        if (waitTime <= hourToMinute) {
          return 'mins';
        } else {
          return 'hours';
        }
      }
    }
  };

  genValueText = (waitTime) => {
    if (waitTime > hourToMinute) {
      return Math.round(waitTime / 60 * 10) / 10;
    } else if (waitTime === 0) {
      return null;
    }
    else {
      return waitTime;
    }
  };

  render() {
    const { queue } = this.props;
    const lastEntry = queue && queue.last();
    const timeNow = new Date().getTime();
    const updateTime = lastEntry &&
                       ((timeNow - lastEntry.loggedAt) / 60000) | 0;

    return (
      <Flex align="center">
        {!queue ?
         <Text>No queues yet.</Text>
         :
         <Stat
           value={this.genValueText(lastEntry.value)}
           label={this.genUpdateText(updateTime)}
           unit={this.genUnitText(lastEntry.value)}
         />
        }
      </Flex>
    );
  }
}

export default connect((state, props) => {
  return {
    queue: state.queues.queueMap.get(`${props.venueKey}`),
  };
}, { checkQueues })(QueueView);
