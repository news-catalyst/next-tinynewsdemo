import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { hasuraGetSourceDistroByGender } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const SourcesByGender = (props) => {
  const sourceRef = useRef();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
    };
    const fetchData = async () => {
      const { errors, data } = await hasuraGetSourceDistroByGender(params);
      let chartValues = [];

      if (errors && !data) {
        console.error(errors);
      }
      let nodeCounter = {};

      data.sources_aggregate.nodes.map((pv) => {
        let label = pv.gender;
        if (!label) {
          label = 'Unknown';
        }
        if (!(label in nodeCounter)) {
          nodeCounter[label] = 0;
        }
        nodeCounter[label] += 1;
      });

      Object.keys(nodeCounter)
        .sort()
        .map((key) => {
          let lineDataPoint = {
            name: key,
            count: parseInt(nodeCounter[key]),
          };
          chartValues.push(lineDataPoint);
        });
      setChartData(chartValues);
    };
    fetchData();

    if (window.location.hash && window.location.hash === '#gender') {
      if (sourceRef) {
        sourceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.site, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={sourceRef}>
        <SubHeader>Sources by Gender</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {format(props.startDate, 'EEEE, MMMM do yyyy')} -{' '}
        {format(props.endDate, 'EEEE, MMMM do yyyy')}
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
        <XAxis
          minTickGap={0}
          tick={{ fontSize: '10px', width: '50px', wordWrap: 'break-word' }}
          height={50}
          interval={0}
          dataKey="name"
        />
        <YAxis domain={[0, 'dataMax + 2']} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </>
  );
};

SourcesByGender.displayName = 'SourcesByGender';

export default SourcesByGender;
