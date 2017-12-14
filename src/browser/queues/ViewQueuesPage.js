import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Select from 'react-select';
import R from 'ramda';

import type { State, Venue, Queue } from '../../common/types';
import { Text, Box } from '../app/components';
import { firebase } from '../../common/lib/redux-firebase';
import { listVenues } from '../../common/venues/actions';
import { checkAllQueues } from '../../common/queues/actions';

import QueueChart from './QueueChart';
import QueuesTable from './QueuesTable';

/* eslint-disable no-unused-vars */
import styles from './custom-select-calendar-styles.css';
/* eslint-enable no-unused-vars */

type Props = {
  queues: { [venueKey: number]: Array<Queue> },
  venues: Array<Venue>,
  listVenues: () => any,
  checkAllQueues: () => any,
}

type ComponentState = {
  venueKey: number,
  weekDay: string,
}

type DataPoint = {
  x: number,
  y: number,
}

class ViewQueuesPage extends React.Component<Props, ComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      venueKey: 1,
      weekDay: 'Saturday',
    };
  }

  prepareDataPoint = (hour: number, minute: number, value: number): DataPoint => ({
    x: (hour + (minute / 60)),
    y: value,
  });

  pickMix = (venue: Venue) => ({
    label: venue.title,
    value: venue.key,
  });

  render() {
    const data = {};
    const { queues, venues } = this.props;
    const { venueKey, weekDay } = this.state;

    const activeFilter = (venue) => venue.active === 1;
    const venueMap = R.map(this.pickMix, R.filter(activeFilter, venues));

    /* eslint-disable no-unused-expressions */
    queues[venueKey] && queues[venueKey].forEach(queue => {
      const time = moment(queue.loggedAt);
      const queueWeekDay: string = time.format('dddd');
      if (queueWeekDay !== weekDay) {
        return;
      }
      const date: string = time.format('YYYYMMDD');
      const hour: number = time.hours();
      const minute: number = time.minutes();
      const dataPoint = this.prepareDataPoint(
        hour, minute, queue.value
      );
      if (data[date]) {
        data[date].push(dataPoint);
      } else {
        data[date] = [];
        data[date].push(dataPoint);
      }
    });
    /* eslint-enable no-unused-expressions */

    return (
      <Box margin={1}>
        <Box
          style={{ width: '250px' }}
        >
          <Select
            placeholder="Select venue"
            value={venueKey}
            name="Venue"
            options={venueMap}
            onChange={(selection) => this.setState({ venueKey: selection.value })}
          />
          <Select
            placeholder="Select week day"
            value={weekDay}
            name="WeekDay"
            options={[
              { label: 'Friday Night', value: 'Saturday' },
              { label: 'Saturday Night', value: 'Sunday' },
            ]}
            onChange={(selection) => this.setState({ weekDay: selection.value })}
          />
        </Box>
        <QueueChart
          queuesData={data}
        />
        <Box marginTop={1}>
          <Text>
            Total of {Object.keys(data).length} queues
          </Text>
        </Box>
        <QueuesTable data={data} />
      </Box>
    );
  }
}

/* eslint-disable no-class-assign */
ViewQueuesPage = firebase((database, props) => {
  /* eslint-enable no-class-assign */
  const queuesRef = database.child('queues');
  return [
    [queuesRef, 'on', 'value', props.checkAllQueues],
  ];
})(ViewQueuesPage);

/* eslint-disable no-class-assign */
ViewQueuesPage = firebase((database, props) => {
  /* eslint-enable no-class-assign */
  const locationsRef = database.child('locations');
  return [
    [locationsRef, 'on', 'value', props.listVenues],
  ];
})(ViewQueuesPage);

export default connect((state: State) => ({
  queues: state.queues.queueMap,
  venues: state.venues.venueList,
}), { checkAllQueues, listVenues })(ViewQueuesPage);
