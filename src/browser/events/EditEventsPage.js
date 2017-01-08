/* @flow */
import type { State } from '../../common/types';
import React from 'react';
import EventList from './EventList';
import EditEvent from './EditEvent';
import NewEvent from './NewEvent';
import { Flex,
         Heading,
         Button,
         Link,
         Loading,
         Text,
         View } from '../app/components';
import { Match, Redirect } from 'react-router';

const EditEventsPage = ({ pathname }: Object) => {
  return (
    <View pl={2} mb={3} mt={3} pr={2}>
      <Match
        exactly
        pattern={pathname}
        render={() => {
            return(
              <View>
                <Link to={`${pathname}/newevent`}>
                  <Button mb={3}
                    theme="primary"
                  >
                    New Event
                  </Button>
                </Link>
                <EventList pathname={pathname} />
              </View>
            );
          }}
      />
      <Match exactly pattern={`${pathname}/newevent`} component={NewEvent} />
      <Match pattern={`${pathname}/event/:eventKey`} component={EditEvent} />
    </View>
  );
};

EditEventsPage.propTypes = {
  pathname: React.PropTypes.string.isRequired,
};

export default EditEventsPage;
