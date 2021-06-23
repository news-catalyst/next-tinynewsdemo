import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetGeoSessions } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const GeoSessions = (props) => {
  const geoRef = useRef();

  const [geoSessions, setGeoSessions] = useState([]);
  const [totalGeoSessions, setTotalGeoSessions] = useState({});

  useEffect(() => {
    let sessionParams = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };

    const fetchGeoSessions = async () => {
      const { errors, data } = await hasuraGetGeoSessions(sessionParams);

      if (errors && !data) {
        console.error(errors);
      }

      setGeoSessions(data.ga_geo_sessions);
      let tgs = {};
      data.ga_geo_sessions.map((session) => {
        if (tgs[session.region]) {
          tgs[session.region] += parseInt(session.count);
        } else {
          tgs[session.region] = parseInt(session.count);
        }
      });
      setTotalGeoSessions(tgs);
    };

    fetchGeoSessions();

    if (window.location.hash && window.location.hash === '#geo') {
      if (geoRef) {
        geoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={geoRef}>
        <SubHeader>Sessions by geographic region</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Country - Region</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalGeoSessions).map((region, i) => (
            <tr key={`geo-report-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {region}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalGeoSessions[region]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GeoSessions;
