/* @flow */
import React from 'react';
import {
  Block,
  Text,
  Link,
  Button,
  PageHeader,
  Title,
  View,
} from '../app/components';

const HomePage = () => (
  <View>
    <Title message="Qfriend" />
    <PageHeader
      description="No queueing, Go clubbing"
      heading="Qfriend"
    />
    {/* This is a block with margin-bottom: scale[4]. Inline styles rocks. */}
    <Block ml={4} mb={4}>
      <Link inverted to="/tonight">
        <Button big>
          <Text>See tonight</Text>
        </Button>
      </Link>
    </Block>
  </View>
);

export default HomePage;
