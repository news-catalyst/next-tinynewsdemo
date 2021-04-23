import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getMetricsData } from '../../../lib/analytics';
import { formatDate } from '../../../lib/utils';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const DailySessions = (props) => {
  const dailyRef = useRef();

  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [reportData, setReportData] = useState(INITIAL_STATE);
  const [chartData, setChartData] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const sessionsMetric = 'ga:sessions';
    const dimensions = ['ga:date'];

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [sessionsMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const total = response.result.reports[0].data.totals[0].values[0];

        setAverage(parseInt(total / response.result.reports[0].data.rowCount));

        let labels = [];
        let values = [];
        let chartValues = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];

          let lineDataPoint = {
            name: formattedDate,
            sessions: parseInt(value),
          };
          chartValues.push(lineDataPoint);

          labels.push(formattedDate);
          values.push(value);
        });
        setReportData({
          ...reportData,
          labels,
          values,
        });
        setChartData(chartValues);

        if (window.location.hash && window.location.hash === '#daily') {
          if (dailyRef) {
            dailyRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={dailyRef}>
        <SubHeader>Sessions per day</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <LineChart width={740} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sessions"
          stroke="#8884d8"
          isAnimationActive={false}
        />
      </LineChart>
    </>
  );
};

export default DailySessions;
