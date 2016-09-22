/* @flow */
import QueuesTonight from './QueuesTonight';
import React from 'react';
import {
  Block,
  PageHeader,
  Title,
  View,
} from '../app/components';

const TonightPage = () => (
  <View>
    <Title message="Tonight" />
    <PageHeader
      description="Queues at all famous venues of Berlin."
      heading="Tonight"
    />
    <Block mb={4}>
      <QueuesTonight />
    </Block>
  </View>
);

export default TonightPage;
