import React, { useEffect, useState, useRef } from 'react';
import tw from 'twin.macro';
// import { parsePageViews } from '../../../lib/utils';
import {
  hasuraGetPageViews,
  hasuraGetArticlePageViews,
  hasuraGetCategoryPageViews,
  hasuraGetAuthorPageViews,
} from '../../../lib/analytics';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;
const SubDek = tw.p`max-w-3xl`;

const PageViews = (props) => {
  const pageviewsRef = useRef();
  const articleViewsRef = useRef();
  const sectionViewsRef = useRef();
  const authorViewsRef = useRef();

  const [sortedPageViews, setSortedPageViews] = useState([]);
  const [totalPageViews, setTotalPageViews] = useState({});
  const [sortedArticlePageViews, setSortedArticlePageViews] = useState([]);
  const [articlePageViews, setArticlePageViews] = useState({});
  const [sortedCategoryPageViews, setSortedCategoryPageViews] = useState([]);
  const [categoryPageViews, setCategoryPageViews] = useState({});
  const [sortedAuthorPageViews, setSortedAuthorPageViews] = useState([]);
  const [authorPageViews, setAuthorPageViews] = useState({});

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
      var counter = 0;
      Object.keys(totalPV).forEach((path) => {
        if (counter < 10) {
          sortable.push([path, totalPV[path]]);
        }
        counter++;
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setTotalPageViews(totalPV);
      setSortedPageViews(sortable);
    };
    fetchPageViews();

    const fetchArticlePageViews = async () => {
      const { errors, data } = await hasuraGetArticlePageViews(pvParams);

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
      var counter = 0;
      Object.keys(totalPV).forEach((path) => {
        if (counter < 10) {
          sortable.push([path, totalPV[path]]);
        }
        counter++;
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setArticlePageViews(totalPV);
      setSortedArticlePageViews(sortable);
    };
    fetchArticlePageViews();

    const fetchCategoryPageViews = async () => {
      const { errors, data } = await hasuraGetCategoryPageViews(pvParams);

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
      var counter = 0;
      Object.keys(totalPV).forEach((path) => {
        if (counter < 10) {
          sortable.push([path, totalPV[path]]);
        }
        counter++;
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setCategoryPageViews(totalPV);
      setSortedCategoryPageViews(sortable);
    };
    fetchCategoryPageViews();

    const fetchAuthorPageViews = async () => {
      const { errors, data } = await hasuraGetAuthorPageViews(pvParams);

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
      var counter = 0;
      Object.keys(totalPV).forEach((path) => {
        if (counter < 10) {
          sortable.push([path, totalPV[path]]);
        }
        counter++;
      });

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      setAuthorPageViews(totalPV);
      setSortedAuthorPageViews(sortable);
    };
    fetchAuthorPageViews();

    if (window.location.hash && window.location.hash === '#pageviews') {
      if (pageviewsRef) {
        pageviewsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.startDate, props.endDate, props.apiToken, props.apiUrl]);

  return (
    <>
      <SubHeaderContainer ref={pageviewsRef}>
        <SubHeader>Top 10 Viewed Pages</SubHeader>
        <SubDek>
          This table shows your most frequently visited pages for your given
          date range across the entire site.
        </SubDek>
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

      <SubHeaderContainer ref={articleViewsRef}>
        <SubHeader>Most Viewed Articles</SubHeader>
        <SubDek>
          This table shows your most frequently visited articles (only) for the
          given date range.
        </SubDek>
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
          {sortedArticlePageViews.map((item, i) => (
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

      <SubHeaderContainer ref={sectionViewsRef}>
        <SubHeader>Most Viewed Section Indexes</SubHeader>
        <SubDek>
          This table shows your most frequently visited section index pages for
          the given date range.
        </SubDek>
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
          {sortedCategoryPageViews.map((item, i) => (
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

      <SubHeaderContainer ref={authorViewsRef}>
        <SubHeader>Most Viewed Author Indexes</SubHeader>
        <SubDek>
          This table shows your most frequently visited author index pages for
          the given date range.
        </SubDek>
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
          {sortedAuthorPageViews.map((item, i) => (
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

PageViews.displayName = 'PageViews';

export default PageViews;
