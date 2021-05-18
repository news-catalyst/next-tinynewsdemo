import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { parseReadingDepth } from '../../../lib/utils';
import {
  hasuraGetPageViews,
  hasuraGetReadingDepthForPath,
} from '../../../lib/analytics';
import moment from 'moment';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysTopTen = (props) => {
  const [updateKey, setUpdateKey] = useState(Math.random());
  const [startDate, setStartDate] = useState(moment().subtract(32, 'days'));
  const [endDate, setEndDate] = useState(moment().subtract(1, 'days'));

  const [sortedTableRows, setSortedTableRows] = useState([]);
  const [totalPageViews, setTotalPageViews] = useState({});

  console.log('props:', props);
  useEffect(() => {
    const fetchPageViews = async () => {
      let totalPV = {};

      props.pageViews.map((pv) => {
        if (!totalPV[pv.path]) {
          totalPV[pv.path] = {
            read_25: 0,
            read_50: 0,
            read_75: 0,
            read_100: 0,
            pageviews: 0,
            conversion: 0,
          };
        }
        totalPV[pv.path]['pageviews'] += parseInt(pv.count);
        props.readingDepth.map((rd) => {
          if (rd.path === pv.path) {
            console.log('Found matching reading depth path:', rd.path);
            totalPV[rd.path]['read_25'] += parseInt(rd.read_25);
            totalPV[rd.path]['read_50'] += parseInt(rd.read_50);
            totalPV[rd.path]['read_75'] += parseInt(rd.read_75);
            totalPV[rd.path]['read_100'] += parseInt(rd.read_100);
          }
        });
      });

      Object.keys(totalPV).map((path, i) => {
        if (totalPV[path]['pageviews'] > 0) {
          let conversion =
            (totalPV[path]['read_100'] / totalPV[path]['pageviews']) * 100;
          totalPV[path]['conversion'] = conversion.toFixed(2);
        }
      });

      var sortable = [];
      Object.keys(totalPV).forEach((path) => {
        sortable.push([path, totalPV[path]['pageviews']]);
      });
      console.log('sortable:', sortable);

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      let rows = [];
      sortable.map((item, i) => {
        if (i >= 10) {
          return;
        }
        console.log('sortable item:', item);
        let label = item[0];
        rows.push(
          <tr key={`page-view-row-${i}`}>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {label}
            </td>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {totalPV[label]['pageviews']}
            </td>
            <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
              {totalPV[label]['conversion']}
            </td>
          </tr>
        );
      });
      setTotalPageViews(totalPV);
      setSortedTableRows(rows);
      setUpdateKey(Math.random());
    };

    fetchPageViews();
    console.log("found yesterday's top ten:", totalPageViews);
  }, [startDate, endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Top 10 Stories Overall</SubHeader>
      </SubHeaderContainer>

      <div key={`message-${updateKey}`}>
        {Object.keys(totalPageViews).length <= 0 && (
          <p tw="px-4">Not enough data for the past 24 hours.</p>
        )}
      </div>

      {Object.keys(totalPageViews).length > 0 && (
        <table tw="w-full table-auto" key={updateKey}>
          <thead>
            <tr>
              <th tw="px-4">Path</th>
              <th tw="px-4">Views</th>
              <th tw="px-4">Read 100%</th>
            </tr>
          </thead>
          <tbody>{sortedTableRows}</tbody>
        </table>
      )}
    </>
  );
};

export default YesterdaysTopTen;
