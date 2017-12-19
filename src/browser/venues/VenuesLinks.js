import React from 'react';

import { Box, Text, Link } from '../app/components';
import type { Venue } from '../../common/types';

type Props = {
  venues: Array<Venue>,
}

const VenuesLinks = (props: Props) => {
  const { venues } = props;
  return (
    <Box
      margin={2}
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      {venues.map((venue) =>
        <Text>
          <Link
            size={-1}
            margin={1}
            to={`/venue/${venue.shortName}`}
          >
            {venue.title}
          </Link>
        </Text>
      )}
    </Box>
  );
};

export default VenuesLinks;
