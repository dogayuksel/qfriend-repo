/* @flow */
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { Link, Space, Toolbar } from '../app/components';
import { connect } from 'react-redux';

const styles = {
  toolbar: {
    flexWrap: 'wrap',
  },
};

const Header = ({ viewer }) => (
  <Toolbar style={styles.toolbar}>
    <Space x={1} />
    <Link bold inverted exactly to="/">
      <FormattedMessage {...linksMessages.home} />
    </Link>
    <Space x={2} />
    <Link bold inverted to="/tonight">
      <FormattedMessage {...linksMessages.tonight} />
    </Link>
    <Space x={1} auto />
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

export default connect(state => ({
  viewer: state.users.viewer,
}))(Header);
