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
    <Title message="Qfriend" />
    <PageHeader
      description="Queues at all famous venues of Berlin."
      heading={queues.size > 0 ? 'Tonight' : 'Featured Events'}
  />
    <Block>
      <QueuesTonight />
    </Block>
  </View>
);

export default connect(state => ({
  queues: state.queues.queueMap,
}))(TonightPage);
