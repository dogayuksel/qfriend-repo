/* @flow */
import { onAdminCheck } from '../../common/admin/actions';
import Gravatar from 'react-gravatar';
import React from 'react';
import SignOut from '../auth/SignOut';
import linksMessages from '../../common/app/linksMessages';
import { Block, Image, Link, Space, Text, Title, View } from '../app/components';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const Navbar = ({ isAdmin }) => (
  <Block>
    <Link index to="/me">
      <FormattedMessage {...linksMessages.me} />
    </Link>
    <Space x={2} />
    <Link to="/me/profile">
      <FormattedMessage {...linksMessages.profile} />
    </Link>
    <Space x={2} />
    <Link to="/me/settings">
      <FormattedMessage {...linksMessages.settings} />
    </Link>
    <Space x={2} />
    {isAdmin &&
    <Link to="/me/logqueue">
      <FormattedMessage {...linksMessages.logQueue} />
    </Link>
    }
  </Block>
);

Navbar.propTypes = {
  isAdmin: React.PropTypes.bool,
};

let MePage = ({ children, viewer, isAdmin }) => {
  const { displayName, email, photoURL } = viewer;

  return (
    <View>
      <Title message={linksMessages.me} />
      <Navbar isAdmin={isAdmin} />
      {children ||
        <View>
          <Text>{displayName}</Text>
          <Block>
            {photoURL ?
              <Image role="presentation" src={photoURL} />
            :
              <Gravatar
                default="retro"
                email={email}
                https
                rating="x"
                size={100}
              />
            }
          </Block>
          <SignOut />
        </View>
      }
    </View>
  );
};

MePage.propTypes = {
  children: React.PropTypes.object,
  viewer: React.PropTypes.object.isRequired,
};

MePage = queryFirebase(MePage, (props) => ({
  path: props.viewer.id && `admins/${props.viewer.id}`,
  on: { value: props.onAdminCheck },
}));

export default connect(state => ({
  viewer: state.users.viewer,
  isAdmin: state.admin.isAdmin,
}), { onAdminCheck })(MePage);
