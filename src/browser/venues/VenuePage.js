import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import {
  Box,
  Paragraph,
  Link,
  PageHeader } from '../app/components';
import type { State, Venue } from '../../common/types';
import { firebase } from '../../common/lib/redux-firebase';
import { listVenues } from '../../common/venues/actions';

type Props = {
  params: {
    shortName: string,
  },
  venue: Venue,
  listVenues: typeof listVenues,
};

let VenuePage = (props: Props) => {
  const { venue } = props;
  return (
    <Box>
      {venue ?
       <Box>
         <PageHeader
           heading={venue.title}
           description={venue.address}
         />
         <Paragraph margin={1}>
           {venue.description}
         </Paragraph>
       </Box>
       :
       <Link
         to="/"
         margin={1}
       >
         Couldn&apos;t find that venue, go back.
       </Link>
      }
    </Box>
  );
};

VenuePage = firebase((database, props) => {
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(VenuePage);

export default connect((state: State, props) => {
  const { shortName } = props.params;
  return {
    venue: R.find(R.propEq('shortName', shortName))(state.venues.venueList),
  };
}, { listVenues })(VenuePage);
