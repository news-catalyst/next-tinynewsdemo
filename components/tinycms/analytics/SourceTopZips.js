import React, { useEffect, useState, useRef } from 'react';
import tw from 'twin.macro';
// import { parsePageViews } from '../../../lib/utils';
import { hasuraGetSourceZipCodes } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const SourceTopZips = (props) => {
  const sourceRef = useRef();
  const [sortedZips, setSortedZips] = useState([]);
  const [totalZips, setTotalZips] = useState({});

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };

    const fetchData = async () => {
      const { errors, data } = await hasuraGetSourceZipCodes(params);

      if (errors && !data) {
        console.error(errors);
      }

      let totalZC = {};
      data.sources_aggregate.nodes.map((pv) => {
        if (!(pv.zip in totalZC)) {
          totalZC[pv.zip] = 0;
        }
        totalZC[pv.zip] += 1;
      });

      var sortable = [];
      Object.keys(totalZC).forEach((zip) => {
        sortable.push([zip, totalZC[zip]]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setTotalZips(totalZC);
      setSortedZips(sortable);
    };
    fetchData();
    if (window.location.hash && window.location.hash === '#zips') {
      if (sourceRef) {
        sourceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={sourceRef}>
        <SubHeader>Source Top Zip Codes</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Zip Code</th>
            <th tw="px-4">Count</th>
          </tr>
        </thead>
        <tbody>
          {sortedZips.map((item, i) => (
            <tr key={`source-zip-row-${i}`}>
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

export default SourceTopZips;
