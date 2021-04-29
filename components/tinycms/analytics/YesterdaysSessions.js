import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { getMetricsData } from '../../../lib/analytics';
import moment from 'moment';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysSessions = (props) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [sessionCount, setSessionCount] = useState(null);

  useEffect(() => {
    const sessionsMetric = 'ga:sessions';
    const dimensions = ['ga:date'];

    getMetricsData(
      props.viewID,
      startDate,
      endDate,
      [sessionsMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;

        // should be one row returned
        queryResult.forEach((row) => {
          let value = row.metrics[0].values[0];
          setSessionCount(value);
        });
      })
      .catch((error) => console.error(error));
  }, [startDate, endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Sessions: {sessionCount}</SubHeader>
      </SubHeaderContainer>
    </>
  );
};

export default YesterdaysSessions;
