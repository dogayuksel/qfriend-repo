import React from 'react';
import { connect } from 'react-redux';

import type { State } from '../../common/types';
import { Text, Box } from '../app/components';
import { firebase } from '../../common/lib/redux-firebase';
import { checkAllQueues } from '../../common/queues/actions';

type Props = {
  queues: Object,
}

let ViewQueuesPage = (props: Props) => {
  const { queues } = props;
  console.log(queues);

  return (
    <Box>
      <Text>Hello</Text>
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
