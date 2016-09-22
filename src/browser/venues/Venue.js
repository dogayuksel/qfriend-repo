/* @flow */
import QueueView from '../queue/QueueView';
import Gravatar from 'react-gravatar';
import React from 'react';
import { connect } from 'react-redux';
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

const Venue = ({ venue: { key, title, description } }) => {
  return (
    <Flex
      mb={3}
      justify="space-between"
      style={styles.bar}
    >
      <Flex align="center">
        <Gravatar
          default="retro"
          email={`${title}@gmail.com`}
          https
          rating="x"
          style={styles.gravatar}
          title={description}
        />
        <Heading size={3}>{title}</Heading>
      </Flex>
      <QueueView venueKey={key} />
    </Flex>
  );
};

Venue.propTypes = {
  venue: React.PropTypes.object.isRequired,
};

export default Venue;
