// @flow
import type { State, User } from '../../common/types';
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { Image, Box, Link, Text } from '../app/components';
import { FormattedMessage } from 'react-intl';
import { compose } from 'ramda';
import { connect } from 'react-redux';

const HeaderLink = ({ exactly, to, message }) => (
  <Link
    backgroundColor="primary"
    bold
    color="white"
    exactly={exactly}
    paddingHorizontal={0.5}
    paddingVertical={0.5}
    to={to}
  >
    <FormattedMessage {...message} />
  </Link>
);

type HeaderProps = {
  viewer: ?User,
  isAdmin: boolean,
};

const Header = ({
  viewer,
  isAdmin
}: HeaderProps ) => (
  <Box
    backgroundColor="primary"
    display="flex"
    flexWrap="wrap"
  >
    <Image
      width={45}
      height={42}
      src={require('./qfriend-logo.png')}
    />
    <HeaderLink exactly to="/" message={linksMessages.home} />
    {isAdmin &&
     <HeaderLink exactly to="/editevents" message={linksMessages.editEvents} />
    }
    <Link
      backgroundColor="primary"
      paddingHorizontal={0.5}
      paddingVertical={0.5}
      target="_blank"
      to="https://www.facebook.com/QFriendBerlin/"
    >
      <Text bold color="white">Facebook</Text>
    </Link>
    {viewer &&
     <HeaderLink to="/me" message={linksMessages.me} />
    }
    {!viewer &&
     <HeaderLink to="/signin" message={linksMessages.signIn} />
    }
  </Box>
);

Header.propTypes = {
  viewer: React.PropTypes.object,
};

export default connect(
  (state: State) => ({
    viewer: state.users.viewer,
    isAdmin: state.admin.isAdmin,
  }),
)(Header);
