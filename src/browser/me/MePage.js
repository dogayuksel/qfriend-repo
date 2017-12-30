// @flow
import type { State, User } from '../../common/types';
import React from 'react';
import SignOut from '../auth/SignOut';
import getUserPhotoUrl from '../../common/users/getUserPhotoUrl';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { Match, Redirect } from 'react-router';
import { connect } from 'react-redux';
import {
  Box,
  Image,
  Link,
  Text,
  Title,
} from '../app/components';

// Pages
import Settings from './SettingsPage';
import LogQueue from './LogQueuePage';

const Navbar = ({ pathname }) => (
  <Box
    marginVertical={2}
    marginHorizontal={1}
  >
    <Link exactly to={pathname} paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.me} />
    </Link>
    <Link to={`${pathname}/settings`} paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.settings} />
    </Link>
  </Box>
);

const AdminNavbar = ({ pathname }) => (
  <Box
    marginVertical={1}
    marginHorizontal={1}
  >
    <Link to={`${pathname}/logqueue`} paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.logQueue} />
    </Link>
    <Link to="/editevents" paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.editEvents} />
    </Link>
    <Link to="/viewqueues" paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.viewQueues} />
    </Link>
  </Box>
);

type MePageProps = {
  pathname: string,
  viewer: User,
  isAdmin: boolean,
};

const MePage = ({ pathname, viewer, isAdmin }): MePageProps => (
  !viewer ?
  <Redirect to="/" />
  :
  <Box marginLeft={2} marginTop={1}>
    <Title message={linksMessages.me} />
    {isAdmin &&
     <Box marginTop={2}>
       <Text marginLeft={2}>Admin Actions</Text>
       <AdminNavbar pathname={pathname} />
     </Box>
    }
    <Navbar pathname={pathname} />
    <Match
      exactly
      pattern={pathname}
      render={() => (
        <Box>
          <Text>{viewer.displayName}</Text>
          <Box marginVertical={1}>
            <Image
              src={getUserPhotoUrl(viewer)}
                  height={100}
                  width={100}
                  title={viewer.displayName}
            />
          </Box>
          <SignOut />
        </Box>
      )}
    />
    <Match pattern={`${pathname}/settings`} component={Settings} />
    <Match pattern={`${pathname}/logqueue`} component={LogQueue} />
  </Box>
);

export default connect(
  (state: State) => ({
    viewer: state.users.viewer,
    isAdmin: state.admin.isAdmin,
  }),
)(MePage);
