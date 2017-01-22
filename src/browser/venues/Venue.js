/* @flow */
import QueueView from '../queue/QueueView';
import Gravatar from 'react-gravatar';
import React from 'react';
import { Heading,
         Loading,
         Link,
         Text,
         Box } from '../app/components';

type VenueProps = {
  event: ?Object,
  venue: {
    key: number,
    title: ?string,
    description: ?string,
  }
}

const styles = {
  venueItem: {
      maxWidth: 475,
  },
  eventLink: {
    fontSize: '0.8em',
    opacity: 0.8,
  },
  title: {
    maxWidth: '55%',
  },
  gravatar: {
    borderRadius: '25%',
    margin: '.5em',
    maxHeight: 50,
  },
};

const Venue = ({ event, venue: { key, title, description } }: VenueProps) => {
  return (
    <Box
      style={styles.venueItem}
    >
      <Box align="center" style={styles.title}>
        <Gravatar
          default="retro"
          email={title && `${title}@gmail.com`}
          rating="x"
          style={styles.gravatar}
          title={description}
        />
        <Box>
          <Heading
            size={3}
            style={styles.title}
          >
            {title}
          </Heading>
          {event &&
           <Link
             style={styles.eventLink}
             theme="primary"
             to={`/event/${event.key}`}
           >
             details
           </Link>
          }
        </Box>
      </Box>
      <QueueView venueKey={key} />
    </Box>
  );
};

Venue.propTypes = {
  venue: React.PropTypes.object.isRequired,
  event: React.PropTypes.object,
};

export default Venue;
