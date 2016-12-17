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
      description={queues.size > 0
                 ? 'No queueing! Go clubbing!'
                 : 'one of our comrades was abducted by aliens.'}
      heading={queues.size > 0 ? 'Tonight' : 'friends'}
    />
    <Text ml={2} mb={4} style={{ maxWidth: '390px' }}>
      We will board our spacecraft and go on a mission to retrieve&nbsp;
      <Link
        target="_blank"
        onClick={() => reportEventClick('st. eggs')}
        to={'https://soundcloud.com/st-eggs'}
        theme="secondary"
      >
        St. Eggs.&nbsp;
      </Link>
      We hope to land back on earth by 7.1.17. Until then, check our weekly updates & write to us if you want logs of the mission. New years out.
    </Text>
    <Block>
      <QueuesTonight />
    </Block>
  </View>
);

export default connect(state => ({
  queues: state.queues.queueMap,
}), { reportEventClick })(TonightPage);
