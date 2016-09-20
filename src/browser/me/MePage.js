/* @flow */
import { onAdminCheck } from '../../common/admin/actions';
import Gravatar from 'react-gravatar';
import React from 'react';
import SignOut from '../auth/SignOut';
import linksMessages from '../../common/app/linksMessages';
import { Block, Image, Link, Space, Text, Title, View } from '../app/components';
import { FormattedMessage } from 'react-intl';
import { Match, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

// Pages
import Profile from './ProfilePage';
import Settings from './SettingsPage';
import LogQueue from './LogQueuePage';

const Navbar = ({ pathname, isAdmin }) => (
  <Block>
    <Link exactly to={pathname}>
      <FormattedMessage {...linksMessages.me} />
    </Link>
    <Space x={2} />
    <Link to={`${pathname}/profile`}>
      <FormattedMessage {...linksMessages.profile} />
    </Link>
    <Space x={2} />
    <Link to={`${pathname}/settings`}>
      <FormattedMessage {...linksMessages.settings} />
    </Link>
    <Space x={2} />
    {isAdmin &&
     <Link to={`${pathname}/logqueue`}>
      <FormattedMessage {...linksMessages.logQueue} />
    </Link>
    }
  </Block>
);

Navbar.propTypes = {
  isAdmin: React.PropTypes.bool,
  pathname: React.PropTypes.string.isRequired,
};

let MePage = ({ pathname, viewer, isAdmin }) => (
  !viewer ?
    <Redirect to="/" />
  :
    <View>
      <Title message={linksMessages.me} />
      <Navbar isAdmin={isAdmin} pathname={pathname} />
      <Match
        exactly
        pattern={pathname}
        render={() => (
          <View>
            <Text>{viewer.displayName}</Text>
            <Block>
              {viewer.photoURL ?
                <Image role="presentation" src={viewer.photoURL} />
              :
                <Gravatar
                  default="retro"
                  email={viewer.email}
                  https
                  rating="x"
                  size={100}
                />
              }
            </Block>
            <SignOut />
          </View>
        )}
      />
      <Match pattern={`${pathname}/profile`} component={Profile} />
      <Match pattern={`${pathname}/settings`} component={Settings} />
      <Match pattern={`${pathname}/logqueue`} component={LogQueue} />
    </View>
);

MePage.propTypes = {
  pathname: React.PropTypes.string.isRequired,
  viewer: React.PropTypes.object,
};

MePage = queryFirebase(MePage, (props) => ({
  path: props.viewer.id && `admins/${props.viewer.id}`,
  on: { value: props.onAdminCheck },
}));

export default connect(state => ({
  viewer: state.users.viewer,
  isAdmin: state.admin.isAdmin,
}), { onAdminCheck })(MePage);
