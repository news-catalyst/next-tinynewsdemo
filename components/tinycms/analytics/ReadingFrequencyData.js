import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { hasuraGetReadingFrequency } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const ReadingFrequencyData = (props) => {
  const frequencyRef = useRef();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    const fetchReadingFrequency = async () => {
      const { errors, data } = await hasuraGetReadingFrequency(params);

      if (errors && !data) {
        console.error(errors);
      }
      let totalRF = {};
      data.ga_reading_frequency.map((rf) => {
        console.log(rf.category, rf.count);
        if (totalRF[rf.category]) {
          totalRF[rf.category] += parseInt(rf.count);
        } else {
          totalRF[rf.category] = parseInt(rf.count);
        }
      });

      setChartData([
        { name: '0 posts', count: totalRF['0 posts'] },
        { name: '1 post', count: totalRF['1 post'] },
        { name: '2-3 posts', count: totalRF['2-3 posts'] },
        { name: '4-5 posts', count: totalRF['4-5 posts'] },
        { name: '6-8 posts', count: totalRF['6-8 posts'] },
        { name: '9-13 posts', count: totalRF['9-13 posts'] },
        { name: '14-21 posts', count: totalRF['14-21 posts'] },
        { name: '22-34 posts', count: totalRF['22-34 posts'] },
        { name: '35-55 posts', count: totalRF['35-55 posts'] },
        { name: '56+', count: totalRF['56+'] },
      ]);
    };
    fetchReadingFrequency();

    if (window.location.hash && window.location.hash === '#frequency') {
      if (frequencyRef) {
        frequencyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={frequencyRef}>
        <SubHeader>Page views by audience segment: reading frequency</SubHeader>
        <SubDek>
          For each of your pageviews, we measure how many pages that viewer has
          visited already. This chart breaks down all of your pageviews by the
          number of posts a user has seen. This helps you know whether you're
          attracting loyal readers or new readers.
        </SubDek>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <BarChart
        width={740}
        height={400}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </>
  );
};

export default ReadingFrequencyData;
