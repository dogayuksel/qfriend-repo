/* @flow */
import React from 'react';
import Image from './Image';
import { Flex } from '../components';
import { PageHeader } from 'rebass';

const styles = {
  logoImage: {
    width: '110px',
    height: '110px',
  },
  pageHeader: {
    maxWidth: '390px',
  },
};

const PageHead = (props: Object) => (
  <Flex>
    <Image
      mt={4} pt={2}
      style={styles.logoImage}
      src={require('./qfriend-logo.png')}
      alt="logo"
    />
    <PageHeader mt={4} style={styles.pageHeader} {...props} />
  </Flex>
);

export default PageHead;
