import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  getMetricsData,
  hasuraGetDonationImpressions,
} from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const DonateClicks = (props) => {
  const donationsRef = useRef();
  const [pageViews, setPageViews] = useState({});
  const [donateTableRows, setDonateTableRows] = useState([]);
  const [donationsFrequencyData, setDonationsFrequencyData] = useState([]);
  const [totalImpressions, setTotalImpressions] = useState({});
  const [frequencySignups, setFrequencySignups] = useState({});

  useEffect(() => {
    const fetchDonationImpressions = async () => {
      let params = {
        url: props.apiUrl,
        orgSlug: props.apiToken,
        startDate: props.startDate.format('YYYY-MM-DD'),
        endDate: props.endDate.format('YYYY-MM-DD'),
      };
      const { errors, data } = await hasuraGetDonationImpressions(params);

      if (errors && !data) {
        console.error(errors);
      }

      let totalImps = {};
      data.ga_donation_impressions.map((row) => {
        if (!totalImps[row.path]) {
          totalImps[row.path] = { clicks: 0 };
        }
        totalImps[row.path]['clicks'] = parseInt(row.impressions); //todo rename this to clicks

        console.log(row);
      });
      data.ga_page_views.map((pv) => {
        if (totalImps[pv.path]) {
          console.log(
            'found matching article for page views:',
            totalImps[pv.path]
          );
          if (totalImps[pv.path]['pageviews']) {
            totalImps[pv.path]['pageviews'] += parseInt(pv.count);
          } else {
            totalImps[pv.path]['pageviews'] = parseInt(pv.count);
          }
        }
      });
      Object.keys(totalImps).map((path) => {
        if (totalImps[path]['pageviews'] > 0) {
          let conversion =
            (totalImps[path]['clicks'] / totalImps[path]['pageviews']) * 100;
          totalImps[path]['conversion'] = conversion;
          console.log(path, conversion, totalImps[path]);
        }
      });
      var sortable = [];
      Object.keys(totalImps).forEach((key) => {
        sortable.push([key, totalImps[key]['conversion']]);
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
              {totalImps[key]['clicks']}
            </td>
            <td
              key={`donate-cell-pageviews-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {totalImps[key]['pageviews']}
            </td>
            <td
              key={`donate-cell-conversion-${i}`}
              tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium"
            >
              {totalImps[key]['conversion']}%
            </td>
          </tr>
        );
      });
      setDonateTableRows(donateRows);
      setTotalImpressions(totalImps);
    };
    fetchDonationImpressions();

    if (window.location.hash && window.location.hash === '#donations') {
      if (donationsRef) {
        donationsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Donate Button Clicks</SubHeader>
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

      {/* <table tw="pt-10 mt-10 w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Reading Frequency</th>
            <th tw="px-4">Clicks</th>
          </tr>
        </thead>
        <tbody>{donationsFrequencyData}</tbody>
      </table> */}
    </>
  );
};

export default DonateClicks;
