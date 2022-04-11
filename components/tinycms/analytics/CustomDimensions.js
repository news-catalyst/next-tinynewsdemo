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
import { hasuraGetCustomDimension } from '../../../lib/analytics';
import { format } from 'date-fns';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const CustomDimensions = (props) => {
  const customRef = useRef();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
      dimension: props.dimension,
    };
    const fetchCustomDimension = async () => {
      const { errors, data } = await hasuraGetCustomDimension(params);

      let chartValues = [];

      if (errors && !data) {
        console.error(errors);
      }
      data.ga_custom_dimensions.map((item) => {
        let lineDataPoint = {
          name: item.date,
          sessions: parseInt(item.count),
        };
        chartValues.push(lineDataPoint);
      });
      setChartData(chartValues);
    };
    fetchCustomDimension();

    if (window.location.hash && window.location.hash === '#sessions') {
      if (customRef) {
        customRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [
    props.startDate,
    props.endDate,
    chartData,
    props.site,
    props.apiUrl,
    props.dimension,
  ]);

  return (
    <>
      <SubHeaderContainer ref={customRef}>
        <SubHeader>Sessions by audience segment: {props.label}</SubHeader>
        <SubDek>{props.dek}</SubDek>
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

CustomDimensions.displayName = 'CustomDimensions';

export default CustomDimensions;
