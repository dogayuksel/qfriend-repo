// @flow
import React from 'react';
import Helmet from 'react-helmet';
import { Miss } from 'react-router';
import { ThemeProvider } from 'react-fela';
import { compose } from 'ramda';
import { connect } from 'react-redux';

import type { State } from '../../common/types';
import type { Theme } from './themes/types';
import * as themes from './themes';
import Footer from './Footer';
import Header from './Header';
import favicon from '../../common/app/favicon';
import start from '../../common/app/start';
import { Match } from '../../common/components';
import {
  Baseline,
  Box,
  Container,
} from './components';

// Pages
import FieldsPage from '../fields/FieldsPage';
import HomePage from '../home/HomePage';
import IntlPage from '../intl/IntlPage';
import MePage from '../me/MePage';
import NotFoundPage from '../notfound/NotFoundPage';
import OfflinePage from '../offline/OfflinePage';
import SignInPage from '../auth/SignInPage';
import TodosPage from '../todos/TodosPage';
import EditEventsPage from '../events/EditEventsPage';
import ViewQueuesPage from '../queues/ViewQueuesPage';
import EventPage from '../events/EventPage';
import UsersPage from '../users/UsersPage';

type AppProps = {
  currentLocale: string,
  themeName: string,
  theme: Theme,
};

const App = ({
  currentLocale,
  theme,
  themeName,
}: AppProps) => (
  <ThemeProvider
    key={themeName} // Enforce rerender.
    theme={theme}
  >
    <Baseline lineHeight={theme.typography.lineHeight}>
      <Container>
        <Helmet
          htmlAttributes={{ lang: currentLocale }}
          meta={[
            {
              name: 'description',
              content: 'Live queue updates from the best clubs of Berlin. Berghain, Tresor, about blank, Renate and many more. Place to check before heading for Berlin Nightlife',
            },
            {
              property: 'og:title',
              content: 'Live queue updates from famous Berlin Clubs',
            },
            // v4-alpha.getbootstrap.com/getting-started/introduction/#starter-template
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            ...favicon.meta,
          ]}
          link={[
            ...favicon.link,
            // To test vertical rhythm visually.
            {
              href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
              rel: 'stylesheet',
            },
            {
              href: 'http://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
              rel: 'stylesheet',
            },
            {
              href: 'https://unpkg.com/react-select/dist/react-select.css',
              rel: 'stylesheet',
            },
          ]}
        />
        <Header />
        <Box
          flex={1} // make footer sticky
        >
          <Match exactly pattern="/" component={HomePage} />
          <Match pattern="/event/:eventId" component={EventPage} />
          <Match pattern="/users" component={UsersPage} />
          <Match pattern="/todos" component={TodosPage} />
          <Match pattern="/fields" component={FieldsPage} />
          <Match pattern="/intl" component={IntlPage} />
          <Match pattern="/offline" component={OfflinePage} />
          <Match pattern="/signin" component={SignInPage} />
          <Match authorized pattern="/editevents" component={EditEventsPage} />
          <Match authorized pattern="/viewqueues" component={ViewQueuesPage} />
          <Match authorized pattern="/me" component={MePage} />
          <Miss component={NotFoundPage} />
        </Box>
        <Footer />
      </Container>
    </Baseline>
  </ThemeProvider>
);

export default compose(
  connect(
    (state: State) => ({
      currentLocale: state.intl.currentLocale,
      themeName: state.app.currentTheme,
      theme: themes[state.app.currentTheme] || themes.defaultTheme,
    }),
  ),
  start,
)(App);
