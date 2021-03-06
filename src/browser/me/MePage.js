// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Match, Redirect } from 'react-router';
import { connect } from 'react-redux';

import type { State, User } from '../../common/types';
import SignOut from '../auth/SignOut';
import getUserPhotoUrl from '../../common/users/getUserPhotoUrl';
import linksMessages from '../../common/app/linksMessages';
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
import AddGuide from './AddGuidePage';

const Navbar = ({ pathname }) => (
  <Box marginVertical={2}>
    <Link exactly to={pathname} paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.me} />
    </Link>
    <Link to={`${pathname}/settings`} paddingHorizontal={0.5}>
      <FormattedMessage {...linksMessages.settings} />
    </Link>
  </Box>
);

const AdminNavbar = ({ pathname }) => (
  <Box display={'flex'} flexWrap={'wrap'}>
    <Link
      to={`${pathname}/logqueue`}
      paddingHorizontal={0.5}
      paddingVertical={0.5}
    >
      <FormattedMessage {...linksMessages.logQueue} />
    </Link>
    <Link
      to="/editevents"
      paddingHorizontal={0.5}
      paddingVertical={0.5}
    >
      <FormattedMessage {...linksMessages.editEvents} />
    </Link>
    <Link
      to="/viewqueues"
      paddingHorizontal={0.5}
      paddingVertical={0.5}
    >
      <FormattedMessage {...linksMessages.viewQueues} />
    </Link>
  </Box>
);

type MePageProps = {
  pathname: string,
  viewer: User,
  isAdmin: boolean,
};

const MePage = ({ pathname, viewer, isAdmin }: MePageProps) => (
  !viewer ?
  <Redirect to="/" />
  :
  <Box marginLeft={2} marginTop={1}>
    <Title message={linksMessages.me} />
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
    {isAdmin &&
     <Box
       marginTop={2}
       marginRight={2}
       padding={0.5}
       style={{ backgroundColor: '#333', maxWidth: '400px' }}
     >
       <Text marginLeft={1}>Admin Actions</Text>
       <AdminNavbar pathname={pathname} />
     </Box>
    }
    <Match pattern={`${pathname}/settings`} component={Settings} />
    <Match pattern={`${pathname}/logqueue`} component={LogQueue} />
    <Match pattern={`${pathname}/addguide`} component={AddGuide} />
  </Box>
);

export default connect(
  (state: State) => ({
    viewer: state.users.viewer,
    isAdmin: state.admin.isAdmin,
  }),
)(MePage);
