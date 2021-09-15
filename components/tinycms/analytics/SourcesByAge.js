import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { hasuraGetSourceDistroByAge } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const SourcesByAge = (props) => {
  const ageRef = useRef();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    const fetchData = async () => {
      const { errors, data } = await hasuraGetSourceDistroByAge(params);
      let chartValues = [];

      if (errors && !data) {
        console.error(errors);
      }
      let nodeCounter = {};

      data.sources_aggregate.nodes.map((pv) => {
        let ageLabel = pv.age;
        if (!(ageLabel in nodeCounter)) {
          nodeCounter[ageLabel] = 0;
        }
        nodeCounter[ageLabel] += 1;
      });

      console.log('node counter:', nodeCounter);

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

    if (window.location.hash && window.location.hash === '#age') {
      if (ageRef) {
        ageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={ageRef}>
        <SubHeader>Sources by Age</SubHeader>
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
        <YAxis domain={[0, 'dataMax + 2']} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </>
  );
};

SourcesByAge.displayName = 'SourcesByAge';
export default SourcesByAge;
