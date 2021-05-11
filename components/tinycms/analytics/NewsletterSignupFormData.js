import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  hasuraGetCustomDimension,
  hasuraGetNewsletterImpressions,
} from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const NewsletterSignupFormData = (props) => {
  const signupRef = useRef();

  const [totalImpressions, setTotalImpressions] = useState({});
  const [frequencySignups, setFrequencySignups] = useState({});

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    let customParams = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
      dimension: props.dimension,
    };
    const fetchCustomDimension = async () => {
      const { errors, data } = await hasuraGetCustomDimension(customParams);

      if (errors && !data) {
        console.error(errors);
      }

      let freqSigns = {};
      data.ga_custom_dimensions.map((item, i) => {
        if (!freqSigns[item.label]) {
          freqSigns[item.label] = 0;
        }
        freqSigns[item.label] += parseInt(item.count);
      });
      setFrequencySignups(freqSigns);
    };
    fetchCustomDimension();

    const fetchNewsletterImpressions = async () => {
      const { errors, data } = await hasuraGetNewsletterImpressions(params);

      if (errors && !data) {
        console.error(errors);
      }

      let totalImps = {};
      data.ga_newsletter_impressions.map((row) => {
        if (!totalImps[row.path]) {
          totalImps[row.path] = { impressions: 0, signups: 0 };
        }

        if (row.action === 'Newsletter Modal Impression 1') {
          totalImps[row.path]['impressions'] += parseInt(row.impressions);
        } else if (row.action === 'Newsletter Signup') {
          totalImps[row.path]['signups'] += parseInt(row.impressions);
        }
      });
      Object.keys(totalImps).map((path) => {
        let conversion = 0;
        let signups = totalImps[path]['signups'];
        let impressions = totalImps[path]['impressions'];
        if (signups && impressions) {
          conversion = (signups / impressions) * 100;
          totalImps[path]['conversion'] = conversion.toFixed(2);
        } else {
          totalImps[path]['conversion'] = 0;
        }
      });
      setTotalImpressions(totalImps);
      // setNewsletterImpressions(data.ga_newsletter_impressions);
    };
    fetchNewsletterImpressions();

    if (window.location.hash && window.location.hash === '#signups') {
      if (signupRef) {
        signupRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate]);

  return (
    <>
      <SubHeaderContainer>
        <SubHeader>Website Signup Form</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="p-4">Location</th>
            <th tw="p-4">Views</th>
            <th tw="p-4">Signups</th>
            <th tw="p-4">Conversion Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(totalImpressions).map((path, i) => (
            <tr key={`newsletter-signup-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {path}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[path]['impressions']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[path]['signups']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[path]['conversion']}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SubHeaderContainer>
        <SubHeader>Signups by Reading Frequency</SubHeader>
      </SubHeaderContainer>

      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="px-4">Articles Read</th>
            <th tw="px-4">Signups</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(frequencySignups).map((label, i) => (
            <tr key={`frequency-signup-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {label}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {frequencySignups[label]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default NewsletterSignupFormData;
