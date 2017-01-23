// @flow
import React from 'react';
import { Box, Text, Link } from './components';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  madeByHtml: {
    defaultMessage: 'Don\'t wait for dancing!',
    id: 'footer.madeByHtml',
  },
});

const AppFooter = () => (
  <Box
    border="top"
    marginTop={1}
    paddingVertical={1}
  >
    <Text
      marginHorizontal={1}
      size={-1}
    >
      Wait less for a mess!
    </Text>
  </Box>
);

export default AppFooter;
