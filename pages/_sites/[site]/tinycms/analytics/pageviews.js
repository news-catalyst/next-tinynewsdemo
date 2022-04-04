import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import PageViews from '../../../../../components/tinycms/analytics/PageViews';
import ReadingDepthData from '../../../../../components/tinycms/analytics/ReadingDepthData';
import ReadingFrequencyData from '../../../../../components/tinycms/analytics/ReadingFrequencyData';
import moment from 'moment';
import DateRangePickerWrapper from '../../../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../../../styles/datepicker.js';
import AnalyticsSidebar from '../../../../../components/tinycms/analytics/AnalyticsSidebar';
import AnalyticsNav from '../../../../../components/tinycms/analytics/AnalyticsNav';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-2/3 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function PageViewsPage(props) {
  const [pageViews, setPageViews] = useState({});

  const [viewID, setViewID] = useState(props.viewId);
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

  const setDates = (sd, ed) => {
    setStartDate(sd);
    setEndDate(ed);
  };

  return (
    <AdminLayout
      host={props.host}
      siteUrl={props.siteUrl}
      authorizedEmailDomains={props.authorizedEmailDomains}
    >
      <AdminNav switchLocales={false} homePageEditor={false} />
      <Container>
        <Sidebar>
          <LightSidebar>
            <SidebarHeading>Navigation</SidebarHeading>
            <AnalyticsNav />
          </LightSidebar>
        </Sidebar>
        <MainContent>
          <SettingsContainer>
            <HeaderContainer>
              <Header>Analytics: Page Views</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                Page views are one of the simplest metrics you can use to
                analyze your audience. Every time a user lands on a page on your
                site, it registers as a page view.
              </p>
              <p tw="p-2">
                However, page views aren&rsquo;t the most important metric. It
                can still be useful to know what your audience is reading.
                Below, you can see what pages your users are seeing, how deeply
                people are reading on those pages, and how frequently particular
                users are reading stories.
              </p>
            </AnalyticsSidebar>

            <DateRangePickerWrapper
              startDate={startDate}
              endDate={endDate}
              setDates={setDates}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />

            <PageViews
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
              setPageViews={setPageViews}
              pageViews={pageViews}
            />

            <ReadingDepthData
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              pageViews={pageViews}
              apiUrl={props.apiUrl}
              site={props.site}
            />

            <ReadingFrequencyData
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
            />
          </SettingsContainer>
        </MainContent>
        <style jsx global>
          {datePickerStyles}
        </style>
      </Container>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const viewId = findSetting(settings, 'NEXT_PUBLIC_ANALYTICS_VIEW_ID');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host; // will give you localhost:3000

  return {
    props: {
      apiUrl,
      site,
      siteUrl,
      host,
      viewId,
      authorizedEmailDomains,
    },
  };
}
