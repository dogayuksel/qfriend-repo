/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import { Text, Box } from '../app/components';
import { connect } from 'react-redux';
import { checkAllQueues } from '../../common/queues/actions';

const hourToMinute = 90;

const makeColor = (time) => {
  if (time < 15) return 'gray';
  if (time < 45) return 'success';
  if (time < 90) return 'warning';
  return 'danger';
}

class QueueView extends React.Component {

  static propTypes = {
    queue: React.PropTypes.array,
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
    const lastEntry = queue && queue[queue.length-1];
    const timeNow = new Date().getTime();
    const updateTime = lastEntry &&
                       ((timeNow - lastEntry.loggedAt) / 60000) | 0;

    return (
      <Box>
        {!queue ?
         <Text>No queues yet.</Text>
         :
         <Box
           display="flex"
           flexDirection="column"
           justifyContent="center"
           alignItems="center"
           paddingVertical={0.1}
           paddingHorizontal={0.1}
           backgroundColor={makeColor(lastEntry.value)}
           border={true}
           borderColor={makeColor(lastEntry.value)}
           borderRadius={40}
         >
           <Box marginVertical={0}>
             <Text color="black" size={0}>
               {this.genValueText(lastEntry.value)}
             </Text>
             <Text color="black" size={0}>
               {this.genUnitText(lastEntry.value)}
             </Text>
           </Box>
           <Box marginTop={-0.45}>
             <Text color="black" size={-2}>
               {this.genUpdateText(updateTime)}
             </Text>
           </Box>
         </Box>
        }
      </Box>
    );
  }
}

export default connect((state: State, props) => {
  return {
    queue: state.queues.queueMap[`${props.venueKey}`],
  };
}, { checkAllQueues })(QueueView);
