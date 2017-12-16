// @flow
import React from 'react';
import { Box, Text, Link } from './components';
import { FormattedMessage, defineMessages } from 'react-intl';
import './footer.css';

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
    className="footer-container"
  >
    <Box
      marginHorizontal={1}
      display="flex"
      flexWrap="wrap"
    >
      <Box>
        <Text
          bold
          size={-1}
          paddingRight={0.2}
        >
          Wait less
        </Text>
      </Box>
      <Box>
        <Text
          bold
          size={-1}
        >
          for a mess!
        </Text>
      </Box>
    </Box>
    <Link
      marginHorizontal={1}
      to="https://www.facebook.com/QFriendBerlin/"
      className="footer-link"
      size={-1}
      color="primary"
      bold
    >
      find us on Facebook
    </Link>
  </Box>
);

export default AppFooter;
