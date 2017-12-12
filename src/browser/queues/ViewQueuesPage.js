import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Select from 'react-select';

import type { State } from '../../common/types';
import { Text, Box } from '../app/components';
import { firebase } from '../../common/lib/redux-firebase';
import { checkAllQueues } from '../../common/queues/actions';
import QueueChart from './QueueChart';

/* eslint-disable no-unused-vars */
import styles from './custom-select-calendar-styles.css';
/* eslint-enable no-unused-vars */

type Props = {
  queues: Object,
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

  render() {
    const data = {};
    const { queues } = this.props;
    const { venueKey, weekDay } = this.state;

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
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
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

export default connect((state: State) => ({
  queues: state.queues.queueMap,
}), { checkAllQueues })(ViewQueuesPage);
