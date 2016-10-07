/* @flow */
import QueuesTonight from './QueuesTonight';
import React from 'react';
import { connect } from 'react-redux';
import {
  Block,
  PageHeader,
  Title,
  View,
} from '../app/components';

const TonightPage = ({ queues }) => (
  <View>
    <Title message="Real-time queue updates from famous Berlin Clubs" />
    <PageHeader
      description={queues.size > 0
                 ? 'No queueing! Go clubbing!'
                 : 'No queues right now... We will cover these on the weekend!'
                  }
      heading={queues.size > 0 ? 'Tonight' : 'Events'}
  />
    <Block>
      <QueuesTonight />
    </Block>
  </View>
);

export default connect(state => ({
  queues: state.queues.queueMap,
}))(TonightPage);
