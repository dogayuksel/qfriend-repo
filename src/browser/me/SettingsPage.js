// @flow
import React from 'react';
import SwitchLocale from '../intl/SwitchLocale';
import linksMessages from '../../common/app/linksMessages';
import {
  Box,
  Paragraph,
  Title,
} from '../app/components';

const SettingsPage = () => (
  <Box>
    <Title message={linksMessages.settings} />
    <SwitchLocale />
    <Paragraph>
      You will soon access your newsletter settings here.
    </Paragraph>
  </Box>
);

export default SettingsPage;
