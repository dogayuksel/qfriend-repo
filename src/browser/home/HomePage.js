/* @flow */
import QueuesTonight from './QueuesTonight';
import React from 'react';
import { reportEventClick } from '../../common/events/actions';
import { connect } from 'react-redux';
import {
  Block,
  PageHeader,
  Title,
  View,
  Text,
  Link,
} from '../app/components';

const TonightPage = ({ queues, reportEventClick }) => (
  <View>
    <Title message="Live queue updates from famous Berlin Clubs" />
    <PageHeader
      description={Object.keys(queues).length
                 ? 'No queueing! Go clubbing!'
                 : 'No queues right now... We will be live this saturday!'}
      heading={Object.keys(queues).length ? 'Tonight' : 'Events'}
    />
    <Block>
      <QueuesTonight />
    </Block>
  </View>
);

export default connect(state => ({
  queues: state.queues.queueMap,
}), { reportEventClick })(TonightPage);
