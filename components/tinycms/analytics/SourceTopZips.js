import React, { useEffect, useState, useRef } from 'react';
import tw from 'twin.macro';
import { format } from 'date-fns';
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
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
    };

    const fetchData = async () => {
      const { errors, data } = await hasuraGetSourceZipCodes(params);

      if (errors && !data) {
        console.error(errors);
      }

      let totalZC = {};
      data.sources_aggregate.nodes.map((pv) => {
        let label = pv.zip;
        if (!label) {
          label = 'Unknown';
        }
        if (!(label in totalZC)) {
          totalZC[label] = 0;
        }
        totalZC[label] += 1;
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
  }, [props.startDate, props.endDate, props.site, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={sourceRef}>
        <SubHeader>Source Top Zip Codes</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {format(props.startDate, 'EEEE, MMMM do yyyy')} -{' '}
        {format(props.endDate, 'EEEE, MMMM do yyyy')}
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

SourceTopZips.displayName = 'SourceTopZips';
export default SourceTopZips;
