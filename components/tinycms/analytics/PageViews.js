import React, { useEffect, useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
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

const tabStyles = {
  open: tw`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal text-white bg-gray-600`,
  closed: tw`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal text-gray-600 bg-white`,
};

const TabButton = styled.a(({ status }) => tabStyles[status]);

const tabContentStyles = {
  open: tw`block`,
  closed: tw`hidden`,
};

const TabContent = styled.div(({ status }) => tabContentStyles[status]);

const PageViews = (props) => {
  const pageviewsRef = useRef();
  const articleViewsRef = useRef();
  const sectionViewsRef = useRef();
  const authorViewsRef = useRef();

  const [openTab, setOpenTab] = React.useState(1);

  const [sortedPageViews, setSortedPageViews] = useState([]);
  const [totalPageViews, setTotalPageViews] = useState({});
  const [sortedArticlePageViews, setSortedArticlePageViews] = useState([]);
  const [articlePageViews, setArticlePageViews] = useState({});
  const [sortedCategoryPageViews, setSortedCategoryPageViews] = useState([]);
  const [categoryPageViews, setCategoryPageViews] = useState({});
  const [sortedAuthorPageViews, setSortedAuthorPageViews] = useState([]);
  const [authorPageViews, setAuthorPageViews] = useState({});

  let color = 'blueGray';

  useEffect(() => {
    let pvParams = {
      url: props.apiUrl,
      site: props.site,
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
  }, [props.startDate, props.endDate, props.site, props.apiUrl]);

  return (
    <>
      <div tw="flex flex-wrap">
        <div tw="w-full">
          <ul
            tw="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li tw="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <TabButton
                status={openTab === 1 ? 'open' : 'closed'}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Overall
              </TabButton>
            </li>
            <li tw="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <TabButton
                status={openTab === 2 ? 'open' : 'closed'}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Articles
              </TabButton>
            </li>
            <li tw="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <TabButton
                status={openTab === 3 ? 'open' : 'closed'}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Sections
              </TabButton>
            </li>
            <li tw="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <TabButton
                status={openTab === 4 ? 'open' : 'closed'}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Authors
              </TabButton>
            </li>
          </ul>
          <div tw="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div tw="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <TabContent
                  status={openTab === 1 ? 'open' : 'closed'}
                  id="link1"
                >
                  <SubHeaderContainer ref={pageviewsRef}>
                    <SubHeader>Top 10 Viewed Overall</SubHeader>
                    <SubDek>
                      This table shows your most frequently visited pages for
                      your given date range across the entire site.
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
                  </table>{' '}
                  <br />
                </TabContent>

                <TabContent
                  status={openTab === 2 ? 'open' : 'closed'}
                  id="link2"
                >
                  {' '}
                  <SubHeaderContainer ref={articleViewsRef}>
                    <SubHeader>Most Viewed Articles</SubHeader>
                    <SubDek>
                      This table shows your most frequently visited articles
                      (only) for the given date range.
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
                </TabContent>
                <TabContent
                  status={openTab === 3 ? 'open' : 'closed'}
                  id="link3"
                >
                  <SubHeaderContainer ref={sectionViewsRef}>
                    <SubHeader>Most Viewed Section Pages</SubHeader>
                    <SubDek>
                      This table shows your most frequently visited section
                      index pages for the given date range.
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
                </TabContent>
              </div>
              <TabContent status={openTab === 4 ? 'open' : 'closed'} id="link4">
                <SubHeaderContainer ref={authorViewsRef}>
                  <SubHeader>Most Viewed Author Pages</SubHeader>
                  <SubDek>
                    This table shows your most frequently visited author index
                    pages for the given date range.
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
              </TabContent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PageViews.displayName = 'PageViews';

export default PageViews;
