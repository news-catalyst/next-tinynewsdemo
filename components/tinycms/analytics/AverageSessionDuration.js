import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { hasuraGetSessionDuration } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p``;

const AverageSessionDuration = (props) => {
  const timeRef = useRef();
  const [timeAverage, setTimeAverage] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let sessionParams = {
      url: props.apiUrl,
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
    };
    const fetchSessionDuration = async () => {
      const { errors, data } = await hasuraGetSessionDuration(sessionParams);
      let chartValues = [];

      if (errors && !data) {
        console.error(errors);
      }
      let totalDuration = 0.0;
      data.ga_session_duration.map((pv) => {
        totalDuration += parseFloat(pv.seconds);
        let lineDataPoint = {
          name: pv.date,
          seconds: parseFloat(pv.seconds),
        };
        chartValues.push(lineDataPoint);
      });
      setChartData(chartValues);
      setTimeAverage(
        parseFloat(totalDuration / data.ga_session_duration.length)
      );
    };
    fetchSessionDuration();

    if (window.location.hash && window.location.hash === '#time') {
      if (timeRef) {
        timeRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiUrl, props.site]);

  return (
    <>
      <SubHeaderContainer ref={timeRef}>
        <SubHeader>Average Session Duration</SubHeader>
        <SubDek>How long are users staying on your page?</SubDek>
      </SubHeaderContainer>
      <p tw="p-2">
        {format(props.startDate, 'EEEE, MMMM do yyyy')} -{' '}
        {format(props.endDate, 'EEEE, MMMM do yyyy')}
      </p>

      <p>Overall average: {timeAverage.toFixed(1)} seconds</p>

      <LineChart width={740} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="seconds"
          stroke="#8884d8"
          isAnimationActive={false}
        />
      </LineChart>
    </>
  );
};

AverageSessionDuration.displayName = 'AverageSessionDuration';

export default AverageSessionDuration;
