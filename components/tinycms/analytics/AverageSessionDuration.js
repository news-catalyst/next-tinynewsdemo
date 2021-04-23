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

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value} seconds`}</p>
//       </div>
//     );
//   }
//   return null;
// };

const AverageSessionDuration = (props) => {
  const timeRef = useRef();
  const INITIAL_STATE = {
    labels: [],
    values: [],
  };
  const [timeReportData, setTimeReportData] = useState(INITIAL_STATE);
  const [timeAverage, setTimeAverage] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const dimensions = ['ga:date'];
    const timeMetric = 'ga:avgSessionDuration';

    getMetricsData(
      props.viewID,
      props.startDate,
      props.endDate,
      [timeMetric],
      dimensions
    )
      .then((response) => {
        const queryResult = response.result.reports[0].data.rows;
        const rowCount = response.result.reports[0].data.rowCount;

        let total = 0;

        let labels = [];
        let values = [];
        let chartValues = [];

        queryResult.forEach((row) => {
          let formattedDate = formatDate(row.dimensions[0]);
          let value = row.metrics[0].values[0];
          total += parseInt(value);

          labels.push(formattedDate);
          values.push(value);

          let lineDataPoint = {
            name: formattedDate,
            duration: parseInt(value),
          };
          chartValues.push(lineDataPoint);
        });

        setTimeAverage(parseInt(total / rowCount));

        setTimeReportData({
          ...timeReportData,
          labels,
          values,
        });

        setChartData(chartValues);

        if (window.location.hash && window.location.hash === '#time') {
          if (timeRef) {
            timeRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      })
      .catch((error) => console.error(error));
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={timeRef}>
        <SubHeader>Average Session Duration</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <p>Overall average: {timeAverage} seconds</p>

      <LineChart width={740} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="duration" stroke="#8884d8" />
      </LineChart>
    </>
  );
};

export default AverageSessionDuration;
