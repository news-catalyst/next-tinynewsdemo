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
import { hasuraGetSessions } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const DailySessions = (props) => {
  const dailyRef = useRef();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let sessionParams = {
      url: props.apiUrl,
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
    };
    const fetchSessions = async () => {
      const { errors, data } = await hasuraGetSessions(sessionParams);
      let chartValues = [];

      if (errors && !data) {
        console.error(errors);
      }
      data.ga_sessions.map((pv) => {
        let lineDataPoint = {
          name: pv.date,
          sessions: parseInt(pv.count),
        };
        chartValues.push(lineDataPoint);
      });

      chartValues.sort((d) => d.name);

      setChartData(chartValues);
    };
    fetchSessions();

    if (window.location.hash && window.location.hash === '#daily') {
      if (dailyRef) {
        dailyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, chartData, props.site, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={dailyRef}>
        <SubHeader>Sessions per day</SubHeader>
        <SubDek>
          How many sessions happen on your site each day? Look for patterns week
          by week. Do more people come on weekdays or weekends? How does that
          align with your publishing schedule?
        </SubDek>
      </SubHeaderContainer>
      <p tw="p-2">
        {format(props.startDate, 'EEEE, MMMM do yyyy')} -{' '}
        {format(props.endDate, 'EEEE, MMMM do yyyy')}
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

DailySessions.displayName = 'DailySessions';

export default DailySessions;
