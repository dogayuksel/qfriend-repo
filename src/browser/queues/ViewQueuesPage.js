import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import type { State } from '../../common/types';
import { Text, Box } from '../app/components';
import { firebase } from '../../common/lib/redux-firebase';
import { checkAllQueues } from '../../common/queues/actions';
import QueueChart from './QueueChart';

type Props = {
  queues: Object,
}

type DataPoint = {
  x: number,
  y: number,
}

let ViewQueuesPage = (props: Props) => {
  const venueKey = 1;

  const data = {};
  const { queues } = props;

  const prepareDataPoint = (hour: number, minute: number, value: number): DataPoint => ({
    x: (hour + (minute / 60)),
    y: value,
  });

  /* eslint-disable no-unused-expressions */
  queues[venueKey] && queues[venueKey].forEach(queue => {
    const time = moment(queue.loggedAt);
    const date: string = time.format('YYYYMMDD');
    const hour: number = time.hours();
    const minute: number = time.minutes();
    const dataPoint = prepareDataPoint(hour, minute, queue.value);
    if (data[date]) {
      data[date].push(dataPoint);
    } else {
      data[date] = [];
      data[date].push(dataPoint);
    }
  });
  /* eslint-enable no-unused-expressions */

  return (
    <Box margin={1}>
      <Text>
        Queue chart for {venueKey}
      </Text>
      <QueueChart
        queuesData={data}
      />
    </Box>
  );
};

ViewQueuesPage = firebase((database, props) => {
  const queuesRef = database.child('queues');
  return [
    [queuesRef, 'on', 'value', props.checkAllQueues],
  ];
})(ViewQueuesPage);

export default connect((state: State) => ({
  queues: state.queues.queueMap,
}), { checkAllQueues })(ViewQueuesPage);
