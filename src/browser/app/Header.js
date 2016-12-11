/* @flow */
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { Link, Space, Toolbar, Text } from '../app/components';
import { connect } from 'react-redux';

const styles = {
  toolbar: {
    flexWrap: 'wrap',
  },
  seperator: {
    color: '#333',
  },
};

const Header = ({ viewer, isAdmin }) => (
  <Toolbar style={styles.toolbar}>
  <Space x={1} />
    <Link bold inverted exactly to="/">
      <FormattedMessage {...linksMessages.home} />
    </Link>
    <Space x={2} />
    {isAdmin &&
    <Link bold inverted to="/editevents">
      <FormattedMessage {...linksMessages.editEvents} />
    </Link>
    }
    <Space x={1} auto />
    <Link
      bold
      inverted
      exactly
      target="_blank"
      to="https://www.facebook.com/QFriendBerlin/"
    >
      fb
    </Link>
    <Space x={2} />
    <Text style={styles.seperator}>|</Text>
    <Space x={2} />
    {viewer &&
     <Link bold inverted to="/me">
       <FormattedMessage {...linksMessages.me} />
     </Link>
    }
    {!viewer &&
     <Link bold inverted to="/signin">
       <FormattedMessage {...linksMessages.signIn} />
     </Link>
    }
    <Space x={1} />
  </Toolbar>
);

Header.propTypes = {
  viewer: React.PropTypes.object,
};

export default connect(
  state => ({
    viewer: state.users.viewer,
    isAdmin: state.admin.isAdmin,
  }),
)(Header);
