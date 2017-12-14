/* @flow */
import React from 'react';
import R from 'ramda';

import { Box, Text } from '../app/components';

type DataPoint = {
  x: number,
  y: number,
}

type QueuesData = {
  [date: string]: Array<DataPoint>,
}

type Props = {
  data: QueuesData,
}

type TableData = { [date: string]: number };

const QueuesTable = (props: Props) => {
  const { data } = props;

  const calculateAverage = R.compose(
    R.mean(),
    R.pluck('y'),
  );
  const tableData: TableData = R
    .map((dp) => calculateAverage(dp))(data);

  const prepareDates = R.compose(
    R.reverse(),
    R.sortBy((date) => tableData[date]),
    R.keys(),
  );
  const dates: Array<string> = prepareDates(tableData);

  return (
    <Box
      display="flex"
      flexDirection="column"
      paddingTop={1}
    >
      <Text bold>Date: Average Queue </Text>
      {dates.map(date =>
        <Text key={date}>
          {date}: {`${tableData[date].toFixed(0)}`.padStart(5)}
        </Text>
      )}
    </Box>
  );
};

export default QueuesTable;
