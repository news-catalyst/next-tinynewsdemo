import React, { useEffect, useState, useRef } from 'react';
import tw from 'twin.macro';
// import { parsePageViews } from '../../../lib/utils';
import { hasuraGetPageViews } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const PageViews = (props) => {
  const pageviewsRef = useRef();
  const [sortedPageViews, setSortedPageViews] = useState([]);
  const [totalPageViews, setTotalPageViews] = useState({});

  useEffect(() => {
    let pvParams = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    const fetchPageViews = async () => {
      const { errors, data } = await hasuraGetPageViews(pvParams);

      if (errors && !data) {
        console.error(errors);
      }
      let totalPV = {};
      data.ga_page_views.map((pv) => {
        if (totalPV[pv.path]) {
          totalPV[pv.path] += parseInt(pv.count);
        } else {
          totalPV[pv.path] = parseInt(pv.count);
        }
      });
      var sortable = [];
      Object.keys(totalPV).forEach((path) => {
        sortable.push([path, totalPV[path]]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setTotalPageViews(totalPV);
      setSortedPageViews(sortable);
    };
    fetchPageViews();
    if (window.location.hash && window.location.hash === '#pageviews') {
      if (pageviewsRef) {
        pageviewsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={pageviewsRef}>
        <SubHeader>Page Views</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Path</th>
            <th tw="px-4">Views</th>
          </tr>
        </thead>
        <tbody>
          {sortedPageViews.map((item, i) => (
            <tr key={`page-view-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {item[0]}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {item[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PageViews;
