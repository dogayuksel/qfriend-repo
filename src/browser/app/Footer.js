/* @flow */
import React from 'react';
import { Text, Footer } from '../app/components';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  madeByHtml: {
    defaultMessage: 'Don\'t wait for dancing!',
    id: 'footer.madeByHtml',
  },
});

const AppFooter = () => (
  <Footer>
    <Text>Wait less for a mess!</Text>
  </Footer>
);

export default AppFooter;
