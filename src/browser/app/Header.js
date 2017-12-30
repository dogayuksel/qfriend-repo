// @flow
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import type { State, User } from '../../common/types';
import linksMessages from '../../common/app/linksMessages';
import { Image, Box, Link } from '../app/components';

type HeaderLinkProps = {
  exactly?: boolean,
  to: string,
  message: Object,
}

const HeaderLink = ({ exactly, to, message }: HeaderLinkProps): Link => (
  <Link
    backgroundColor="primary"
    bold
    color="black"
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
}: HeaderProps) => (
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
    <HeaderLink exactly to="/venues" message={linksMessages.venues} />
    <HeaderLink exactly to="/guides" message={linksMessages.guides} />
    {viewer ?
     <HeaderLink to="/me" message={linksMessages.me} />
     :
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
  }),
)(Header);
