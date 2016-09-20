/* @flow */
import VenueList from '../venues/VenueList';
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
      <VenueList />
    </Block>
  </View>
);

export default TonightPage;
