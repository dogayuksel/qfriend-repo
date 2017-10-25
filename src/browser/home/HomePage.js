// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { State } from '../../common/types';
import QueuesTonight from './QueuesTonight';
import {
  Box,
  PageHeader,
  Title,
} from '../app/components';

const TonightPage = ({ queues }) => (
  <Box>
    <Title message="Live queue updates from famous Berlin Clubs" />
    <PageHeader
      description={Object.keys(queues).length > 0
                 ? 'No queueing! Go clubbing!'
                 : 'No queues right now... We will be live this saturday!'}
      heading={Object.keys(queues).length ? 'Tonight' : 'Events'}
    />
    <Box>
      <QueuesTonight />
    </Box>
  </Box>
);

export default connect((state: State) => ({
  queues: state.queues.queueMap,
}))(TonightPage);
