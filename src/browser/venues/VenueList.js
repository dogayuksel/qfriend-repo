/* @flow */
import QueueData from '../queue/QueueData';
import Gravatar from 'react-gravatar';
import React from 'react';
import { connect } from 'react-redux';
import { listVenues } from '../../common/venues/actions';
import { firebase } from '../../common/lib/redux-firebase';
import { Flex,
         Heading,
         Loading,
         Text,
         View } from '../app/components';

const styles = {
  bar: {
    maxWidth: '500px',
  },
  gravatar: {
    borderRadius: '25%',
    margin: '.5em',
    maxHeight: 50,
  },
};

const Venue = ({ venue: { key, title, description } }) => (
  <Flex
    mb={3}
    justify="space-between"
    style={styles.bar}
  >
    <Flex align="center">
      <Gravatar
        default="retro"
        email={`${title}@gmail.com`} // For users signed in via email.
        https
        rating="x"
        style={styles.gravatar}
        title={description}
      />
      <Heading size={3}>{title}</Heading>
    </Flex>
    <QueueData venueKey={key} />
  </Flex>
);

Venue.propTypes = {
  venue: React.PropTypes.object.isRequired,
};

let VenueList = ({ loaded, venues }) => (
  <View>
  {!loaded ?
    <Loading />
  : !venues ?
    <Text>No active venues.</Text>
  :
   venues.map(venue =>
     <Venue key={venue.key} venue={venue} />
    )
   }
  </View>
);

VenueList.propTypes = {
  venues: React.PropTypes.object,
  loaded: React.PropTypes.bool.isRequired,
};

VenueList = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(VenueList);

export default connect(state => ({
  venues: state.venues.venues,
  loaded: state.venues.venuesLoaded,
}), { listVenues })(VenueList);
