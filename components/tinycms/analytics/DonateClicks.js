import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetDonationClicks } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const DonateClicks = (props) => {
  const donationsRef = useRef();

  const [donateTableRows, setDonateTableRows] = useState([]);
  const [donorFrequencyRows, setDonorFrequencyRows] = useState([]);
  const [totalClickDatas, setTotalClickDatas] = useState({});

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
          };
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

      Object.keys(totalClicks).map((path) => {
        if (totalClicks[path]['pageviews'] > 0) {
          let conversion =
            (totalClicks[path]['clicks'] / totalClicks[path]['pageviews']) *
            100;
          totalClicks[path]['conversion'] = conversion.toFixed(2);
        }
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
      setTotalClickDatas(totalClicks);

      let donorFreqRows = [];
      Object.keys(donorFrequency)
        .sort()
        .map((date, i) => {
          let uniqueRowKey = `frequency-table-row-${i}`;
          donorFreqRows.push(
            <tr key={uniqueRowKey}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {date}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['1 post'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['2-3 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['4-5 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['6-8 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['9-13 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['14-21 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['22-34 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['35-55 posts'] || 0}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {donorFrequency[date]['56+'] || 0}
              </td>
            </tr>
          );
        });
      setDonorFrequencyRows(donorFreqRows);
    };
    fetchDonationClicks();

    if (window.location.hash && window.location.hash === '#donations') {
      if (donationsRef) {
        donationsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={donationsRef}>
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

      <SubHeaderContainer>
        <SubHeader>Donate Button Clicks by Reading Frequency</SubHeader>
        <SubDek>
          This table shows you whether frequent readers or new readers or more
          likely to click your donate buttons across your site.
        </SubDek>
      </SubHeaderContainer>
      <table tw="pt-10 mt-10 w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Date</th>
            <th tw="px-4">1 Post</th>
            <th tw="px-4">2-3 Posts</th>
            <th tw="px-4">4-5 Posts</th>
            <th tw="px-4">6-8 Posts</th>
            <th tw="px-4">9-13 Posts</th>
            <th tw="px-4">14-21 Posts</th>
            <th tw="px-4">22-34 Posts</th>
            <th tw="px-4">35-55 Posts</th>
            <th tw="px-4">56+</th>
          </tr>
        </thead>
        <tbody>{donorFrequencyRows}</tbody>
      </table>
    </>
  );
};

export default DonateClicks;
