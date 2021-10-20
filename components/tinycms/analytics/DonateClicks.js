import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetDonationClicks } from '../../../lib/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const SubHeaderContainer = tw.div`pt-5 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const DonateClicks = (props) => {
  const clicksRef = useRef();
  const conversionsRef = useRef();
  const frequencyRef = useRef();

  const [donateTableRows, setDonateTableRows] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [donateClicksByCategory, setDonateClicksByCategory] = useState({});
  const [categoryTableRows, setCategoryTableRows] = useState([]);

  useEffect(() => {
    const fetchDonationClicks = async () => {
      let params = {
        url: props.apiUrl,
        orgSlug: props.apiToken,
        startDate: props.startDate.format('YYYY-MM-DD'),
        endDate: props.endDate.format('YYYY-MM-DD'),
      };
      const { errors, data } = await hasuraGetDonationClicks(params);

      if (errors && !data) {
        console.error(errors);
      }

      let totalClicks = {};
      data.ga_donation_clicks.map((row) => {
        if (!totalClicks[row.path]) {
          totalClicks[row.path] = {
            clicks: 0,
            pageviews: 0,
            conversion: 0,
            read_25: 0,
            read_50: 0,
            read_75: 0,
            read_100: 0,
            category: null,
          };
        }

        if (row.path.match(/\/articles\//)) {
          let pathParts = row.path.split('/');
          if (pathParts && pathParts[2]) {
            totalClicks[row.path]['category'] = pathParts[2];
          }
        }

        totalClicks[row.path]['clicks'] = parseInt(row.count);
      });
      data.ga_page_views.map((pv) => {
        if (totalClicks[pv.path]) {
          if (totalClicks[pv.path]['pageviews']) {
            totalClicks[pv.path]['pageviews'] += parseInt(pv.count);
          } else {
            totalClicks[pv.path]['pageviews'] = parseInt(pv.count);
          }
        }
      });
      let donorFrequency = {};
      data.ga_donor_reading_frequency.map((rd) => {
        if (!donorFrequency[rd.date]) {
          donorFrequency[rd.date] = {};
        }
        if (donorFrequency[rd.date][rd.label]) {
          donorFrequency[rd.date][rd.label] += parseInt(rd.count);
        } else {
          donorFrequency[rd.date][rd.label] = parseInt(rd.count);
        }
      });

      let clicksByCategory = {};
      Object.keys(totalClicks).map((path) => {
        if (totalClicks[path]['category']) {
          let category = totalClicks[path]['category'];
          // console.log(
          //   totalClicks[path]['category'],
          //   totalClicks[path]['clicks']
          // );
          if (!clicksByCategory[category]) {
            clicksByCategory[category] = {
              clicks: 0,
              pageviews: 0,
              conversion: 0,
            };
          }
          clicksByCategory[category]['clicks'] += parseInt(
            totalClicks[path]['clicks']
          );
          clicksByCategory[category]['pageviews'] += parseInt(
            totalClicks[path]['pageviews']
          );
        }

        if (totalClicks[path]['pageviews'] > 0) {
          let conversion =
            (totalClicks[path]['clicks'] / totalClicks[path]['pageviews']) *
            100;
          totalClicks[path]['conversion'] = conversion.toFixed(2);
        }
      });
      Object.keys(clicksByCategory).map((category) => {
        if (clicksByCategory[category]['pageviews'] > 0) {
          let conversion =
            (clicksByCategory[category]['clicks'] /
              clicksByCategory[category]['pageviews']) *
            100;
          clicksByCategory[category]['conversion'] = conversion.toFixed(2);
        }
      });
      setDonateClicksByCategory(clicksByCategory);
      // console.log('clicksByCategory:', clicksByCategory);

      var categorySortable = [];
      Object.keys(clicksByCategory).forEach((key) => {
        categorySortable.push([key, clicksByCategory[key]['conversion']]);
      });
      categorySortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      var sortable = [];
      Object.keys(totalClicks).forEach((key) => {
        sortable.push([key, totalClicks[key]['conversion']]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      let donateRows = [];
      sortable.map((item, i) => {
        let key = item[0];
        let uniqueRowKey = `donate-table-row-${i}`;
        donateRows.push(
          <tr key={uniqueRowKey}>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {key}
            </td>
            <td
              key={`donate-cell-count-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {totalClicks[key]['clicks']}
            </td>
            <td
              key={`donate-cell-pageviews-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {totalClicks[key]['pageviews']}
            </td>
            <td
              key={`donate-cell-conversion-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {totalClicks[key]['conversion']}%
            </td>
          </tr>
        );
      });
      setDonateTableRows(donateRows);

      let categoryRows = [];
      categorySortable.map((item, i) => {
        let key = item[0];
        let uniqueRowKey = `category-table-row-${i}`;
        categoryRows.push(
          <tr key={uniqueRowKey}>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {key}
            </td>
            <td
              key={`donate-cell-count-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {clicksByCategory[key]['clicks']}
            </td>
            <td
              key={`donate-cell-pageviews-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {clicksByCategory[key]['pageviews']}
            </td>
            <td
              key={`donate-cell-conversion-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {clicksByCategory[key]['conversion']}%
            </td>
          </tr>
        );
      });
      setCategoryTableRows(categoryRows);

      let chartDataItems = [];
      let chartDataPerPost = {
        '1 Post': 0,
        '2-3 Posts': 0,
        '4-5 Posts': 0,
        '6-8 Posts': 0,
        '9-13 Posts': 0,
        '14-21 Posts': 0,
        '22-34 Posts': 0,
        '35-55 Posts': 0,
        '56+': 0,
      };
      Object.keys(donorFrequency)
        .sort()
        .map((date, i) => {
          chartDataPerPost['1 Post'] += donorFrequency[date]['1 post'] || 0;
          chartDataPerPost['2-3 Posts'] +=
            donorFrequency[date]['2-3 posts'] || 0;
          chartDataPerPost['4-5 Posts'] +=
            donorFrequency[date]['4-5 posts'] || 0;
          chartDataPerPost['6-8 Posts'] +=
            donorFrequency[date]['6-8 posts'] || 0;
          chartDataPerPost['9-13 Posts'] +=
            donorFrequency[date]['9-13 posts'] || 0;
          chartDataPerPost['14-21 Posts'] +=
            donorFrequency[date]['14-21 posts'] || 0;
          chartDataPerPost['22-34 Posts'] +=
            donorFrequency[date]['22-34 posts'] || 0;
          chartDataPerPost['35-55 Posts'] +=
            donorFrequency[date]['35-55 posts'] || 0;
          chartDataPerPost['56+ Posts'] +=
            donorFrequency[date]['56+ posts'] || 0;
        });

      Object.keys(chartDataPerPost).map((key) => {
        chartDataItems.push({
          name: key,
          count: chartDataPerPost[key] || 0,
        });
      });
      setChartData(chartDataItems);
    };
    fetchDonationClicks();

    if (window.location.hash && window.location.hash === '#clicks') {
      if (clicksRef) {
        clicksRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (window.location.hash && window.location.hash === '#conversions') {
      if (conversionsRef) {
        conversionsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (window.location.hash && window.location.hash === '#frequency') {
      if (frequencyRef) {
        frequencyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={clicksRef}>
        <SubHeader>Donate Button Clicks with Page Views</SubHeader>
        <SubDek>
          This table shows you which of your pages are getting people to click
          the donation prompt.
        </SubDek>
      </SubHeaderContainer>

      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr key="header-row">
            <th tw="px-4">Article</th>
            <th tw="px-4">Clicks</th>
            <th tw="px-4">Views</th>
            <th tw="px-4">Conversion</th>
          </tr>
        </thead>
        <tbody>{donateTableRows}</tbody>
      </table>

      <SubHeaderContainer ref={conversionsRef}>
        <SubHeader>Donate Button Conversions by Section</SubHeader>
        <SubDek>
          This table shows you which article sections, or categories, are best
          performing for donations.
        </SubDek>
      </SubHeaderContainer>

      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr key="header-row">
            <th tw="px-4">Category</th>
            <th tw="px-4">Clicks</th>
            <th tw="px-4">Views</th>
            <th tw="px-4">Conversion</th>
          </tr>
        </thead>
        <tbody>{categoryTableRows}</tbody>
      </table>

      <SubHeaderContainer ref={frequencyRef}>
        <SubHeader>Donate Button Clicks by Reading Frequency</SubHeader>
        <SubDek>
          This table shows you whether frequent readers or new readers or more
          likely to click your donate buttons across your site.
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

DonateClicks.displayName = 'DonateClicks';
export default DonateClicks;
