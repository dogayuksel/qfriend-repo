/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import EventList from './EventList';
import EditEvent from './EditEvent';
import NewEvent from './NewEvent';
import { Box,
         Heading,
         Button,
         Link,
         Loading,
         Text } from '../app/components';
import { Match, Redirect } from 'react-router';

const EditEventsPage = ({ pathname }: Object) => {
  return (
    <Box>
      <Match
        exactly
        pattern={pathname}
        render={() => {
            return(
              <Box>
                <Link to={`${pathname}/newevent`}>
                  <Button>
                    New Event
                  </Button>
                </Link>
                <EventList pathname={pathname} />
              </Box>
            );
          }}
      />
      <Match exactly pattern={`${pathname}/newevent`} component={NewEvent} />
      <Match pattern={`${pathname}/event/:eventKey`} component={EditEvent} />
    </Box>
  );
};

EditEventsPage.propTypes = {
  pathname: React.PropTypes.string.isRequired,
};

export default EditEventsPage;
