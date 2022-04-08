import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import { format } from 'date-fns';
import { hasuraGetReferralSessions } from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const ReferralSource = (props) => {
  const referralRef = useRef();

  const [referralSessions, setReferralSessions] = useState([]);
  const [totalReferralSessions, setTotalReferralSessions] = useState({});
  const [sortedReferralSessions, setSortedReferralSessions] = useState([]);

  useEffect(() => {
    let sessionParams = {
      url: props.apiUrl,
      site: props.site,
      startDate: format(props.startDate, 'yyyy-MM-dd'),
      endDate: format(props.endDate, 'yyyy-MM-dd'),
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
      var sortable = [];
      Object.keys(trs).forEach((key) => {
        sortable.push([key, trs[key]]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      setTotalReferralSessions(trs);
      setSortedReferralSessions(sortable);
    };

    fetchReferralSessions();

    if (window.location.hash && window.location.hash === '#referral') {
      if (referralRef) {
        referralRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.site, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={referralRef}>
        <SubHeader>Session by referral source</SubHeader>
        <SubDek>
          Where on the internet are your sessions coming from? Note: (direct)
          means the user came directly to your site, not via a link from
          elsewhere on the internet.
        </SubDek>
      </SubHeaderContainer>
      <p tw="p-2">
        {format(props.startDate, 'EEEE, MMMM do yyyy')} -{' '}
        {format(props.endDate, 'EEEE, MMMM do yyyy')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Subscriber</th>
            <th tw="px-4">Sessions</th>
          </tr>
        </thead>
        <tbody>
          {sortedReferralSessions.map((item, i) => (
            <tr key={`referral-data-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {item[0]}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalReferralSessions[item[0]]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

ReferralSource.displayName = 'ReferralSource';
export default ReferralSource;
