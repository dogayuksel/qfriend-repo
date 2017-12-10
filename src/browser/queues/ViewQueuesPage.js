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

let ViewQueuesPage = (props: Props) => {
  const venueKey = 1;

  const preparePlotData = () => {
    const { queues } = props;
    const data = queues[venueKey] && queues[venueKey].map(queue => {
      const time = moment(queue.loggedAt);
      const date = time.format('YYYYMMDD');
      return queue.value;
    });
    return data;
  };

  const data = preparePlotData();
  console.log(data);

  return (
    <Box margin={1}>
      <Text>
        Queue chart for {venueKey}
      </Text>
      <QueueChart
        queuesData={[
          { y: 10, x: 0.3 },
          { y: 40, x: 1.2 },
          { y: 70, x: 2.5 },
          { y: 30, x: 3.3 },
        ]}
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
