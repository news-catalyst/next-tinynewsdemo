import React, { useState, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  hasuraGetCustomDimension,
  hasuraGetNewsletterImpressions,
  hasuraGetArticleSessions,
} from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-5 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const NewsletterSignupFormData = (props) => {
  const signupRef = useRef();
  const sectionRef = useRef();
  const frequencyRef = useRef();

  const [chartData, setChartData] = useState([]);
  const [sessionsByCategory, setSessionsByCategory] = useState({});
  const [totalImpressions, setTotalImpressions] = useState({});
  const [sortedImpressions, setSortedImpressions] = useState([]);
  const [categoryImpressions, setCategoryImpressions] = useState({});
  const [sortedCategoryImpressions, setSortedCategoryImpressions] = useState(
    []
  );

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      site: props.site,
      startDate: props.startDate.format('YYYY-MM-DD'),
      endDate: props.endDate.format('YYYY-MM-DD'),
    };
    let customParams = {
      url: props.apiUrl,
      site: props.site,
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
      setChartData([
        { name: '0 posts', count: freqSigns['0 posts'] },
        { name: '1 post', count: freqSigns['1 post'] },
        { name: '2-3 posts', count: freqSigns['2-3 posts'] },
        { name: '4-5 posts', count: freqSigns['4-5 posts'] },
        { name: '6-8 posts', count: freqSigns['6-8 posts'] },
        { name: '9-13 posts', count: freqSigns['9-13 posts'] },
        { name: '14-21 posts', count: freqSigns['14-21 posts'] },
        { name: '22-34 posts', count: freqSigns['22-34 posts'] },
        { name: '35-55 posts', count: freqSigns['35-55 posts'] },
        { name: '56+', count: freqSigns['56+'] },
      ]);
    };
    fetchCustomDimension();

    const fetchArticleSessions = async () => {
      const { errors, data } = await hasuraGetArticleSessions(params);

      if (errors && !data) {
        console.error(errors);
      }

      let articleSessions = {};
      data.ga_article_sessions.map((item, i) => {
        if (!articleSessions[item.category]) {
          articleSessions[item.category] = 0;
        }
        articleSessions[item.category] += parseInt(item.count);
      });
      setSessionsByCategory(articleSessions);
    };
    fetchArticleSessions();

    const fetchNewsletterImpressions = async () => {
      const { errors, data } = await hasuraGetNewsletterImpressions(params);

      if (errors && !data) {
        console.error(errors);
      }
      let totalImps = {};
      data.ga_newsletter_impressions.map((row) => {
        if (row.path.match(/\/articles\//)) {
          if (!totalImps[row.path]) {
            totalImps[row.path] = {
              impressions: 0,
              signups: 0,
              category: null,
            };
          }

          let pathParts = row.path.split('/');
          if (pathParts && pathParts[2]) {
            totalImps[row.path]['category'] = pathParts[2];
          }

          if (row.action === 'Newsletter Modal Impression 1') {
            totalImps[row.path]['impressions'] += parseInt(row.impressions);
          } else if (row.action === 'Newsletter Signup') {
            // console.log('sign up row:', row);
            totalImps[row.path]['signups'] += parseInt(row.impressions);
          }
        }
      });

      let newsletterByCategory = {};
      Object.keys(totalImps).map((path) => {
        let conversion = 0;
        let signups = totalImps[path]['signups'];
        let impressions = totalImps[path]['impressions'];
        if (signups && impressions) {
          conversion = (signups / impressions) * 100;
          totalImps[path]['conversion'] = conversion;
        } else {
          totalImps[path]['conversion'] = 0.0;
        }

        if (totalImps[path]['category']) {
          let category = totalImps[path]['category'];

          if (!newsletterByCategory[category]) {
            newsletterByCategory[category] = {
              signups: 0,
              impressions: 0,
              sessions: 0,
              conversion: 0.0,
            };
          }

          newsletterByCategory[category]['signups'] += parseInt(
            totalImps[path]['signups']
          );
          newsletterByCategory[category]['impressions'] += parseInt(
            totalImps[path]['impressions']
          );
          newsletterByCategory[category]['conversion'] +=
            totalImps[path]['conversion'];

          if (sessionsByCategory[category]) {
            newsletterByCategory[category]['sessions'] = parseInt(
              sessionsByCategory[category]
            );

            // console.log(category, 'sessions:', newsletterByCategory[category]);
          }
        }
      });

      setCategoryImpressions(newsletterByCategory);
      setTotalImpressions(totalImps);

      var categorySortable = [];
      Object.keys(newsletterByCategory).forEach((key) => {
        if (newsletterByCategory[key]['signups'] > 0) {
          categorySortable.push([key, newsletterByCategory[key]['signups']]);
        }
      });

      categorySortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      setSortedCategoryImpressions(categorySortable);

      var sortable = [];
      Object.keys(totalImps).forEach((key) => {
        sortable.push([key, totalImps[key]['signups']]);
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      setSortedImpressions(sortable);
      // setNewsletterImpressions(data.ga_newsletter_impressions);
    };
    fetchNewsletterImpressions();

    if (window.location.hash && window.location.hash === '#signups') {
      if (signupRef) {
        signupRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (window.location.hash && window.location.hash === '#section') {
      if (sectionRef) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (window.location.hash && window.location.hash === '#frequency') {
      if (frequencyRef) {
        frequencyRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [
    props.startDate,
    props.endDate,
    props.site,
    props.apiUrl,
    props.dimension,
  ]);

  return (
    <>
      <SubHeaderContainer ref={signupRef}>
        <SubHeader>Signups</SubHeader>
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
          {sortedImpressions.map((impressionData, i) => (
            <tr key={`newsletter-signup-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {impressionData[0]}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[impressionData[0]]['impressions']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[impressionData[0]]['signups']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {totalImpressions[impressionData[0]]['conversion'].toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SubHeaderContainer ref={sectionRef}>
        <SubHeader>Signups by Section</SubHeader>
      </SubHeaderContainer>
      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <table tw="w-full table-auto">
        <thead>
          <tr>
            <th tw="p-4">Category</th>
            <th tw="p-4">Signups</th>
            <th tw="p-4">Total Sessions</th>
            <th tw="p-4">Views</th>
            <th tw="p-4">Conversion by View</th>
            <th tw="p-4">Conversion by Session</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategoryImpressions.map((impressionData, i) => (
            <tr key={`newsletter-category-signup-row-${i}`}>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {impressionData[0]}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {categoryImpressions[impressionData[0]]['signups']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {categoryImpressions[impressionData[0]]['sessions']}
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {categoryImpressions[impressionData[0]]['impressions']}
              </td>

              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {categoryImpressions[impressionData[0]]['conversion'].toFixed(
                  2
                )}
                %
              </td>
              <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                {categoryImpressions[impressionData[0]]['sessions'] <= 0 &&
                  'N/A'}
                {categoryImpressions[impressionData[0]]['sessions'] > 0 &&
                  `${(
                    (categoryImpressions[impressionData[0]]['signups'] /
                      categoryImpressions[impressionData[0]]['sessions']) *
                    100
                  ).toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SubHeaderContainer ref={frequencyRef}>
        <SubHeader>Signups by Reading Frequency</SubHeader>
      </SubHeaderContainer>

      <p tw="p-2">
        {props.startDate.format('dddd, MMMM Do YYYY')} -{' '}
        {props.endDate.format('dddd, MMMM Do YYYY')}
      </p>

      <BarChart
        width={740}
        height={400}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </>
  );
};

NewsletterSignupFormData.displayName = 'NewsletterSignupFormData';
export default NewsletterSignupFormData;
