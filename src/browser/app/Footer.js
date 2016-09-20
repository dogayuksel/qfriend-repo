/* @flow */
import React from 'react';
import { Footer } from '../app/components';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  madeByHtml: {
    defaultMessage: 'Don\'t wait for dancing!',
    id: 'footer.madeByHtml',
  },
});

const AppFooter = () => (
  <Footer>
    <FormattedMessage {...messages.madeByHtml} />
  </Footer>
);

export default AppFooter;
