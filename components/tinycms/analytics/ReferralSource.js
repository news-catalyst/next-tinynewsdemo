import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { hasuraGetReferralSessions } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const ReferralSource = (props) => {
  const referralRef = useRef();

  const [referralSessions, setReferralSessions] = useState([]);
  const [totalReferralSessions, setTotalReferralSessions] = useState({});

  useEffect(() => {
    let sessionParams = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };

    const fetchReferralSessions = async () => {
      const { errors, data } = await hasuraGetReferralSessions(sessionParams);

      if (errors && !data) {
        console.error(errors);
      }

      setReferralSessions(data.ga_referral_sessions);
      let trs = {};
      data.ga_referral_sessions.map((session) => {
        if (trs[session.source]) {
          trs[session.source] += parseInt(session.count);
        } else {
          trs[session.source] = parseInt(session.count);
        }
      });
      setTotalReferralSessions(trs);
    };

    fetchReferralSessions();

    if (window.location.hash && window.location.hash === '#referral') {
      if (referralRef) {
        referralRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer ref={referralRef}>
        <SubHeader>Session by referral source</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Subscriber</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalReferralSessions).map((source, i) => (
            <tr key={`referral-data-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {source}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReferralSessions[source]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReferralSource;
