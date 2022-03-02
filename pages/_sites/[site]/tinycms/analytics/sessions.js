import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import moment from 'moment';
import DateRangePickerWrapper from '../../../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../../../styles/datepicker.js';
import AverageSessionDuration from '../../../../../components/tinycms/analytics/AverageSessionDuration';
import DailySessions from '../../../../../components/tinycms/analytics/DailySessions';
import GeoSessions from '../../../../../components/tinycms/analytics/GeoSessions';
import ReferralSource from '../../../../../components/tinycms/analytics/ReferralSource';
import AnalyticsSidebar from '../../../../../components/tinycms/analytics/AnalyticsSidebar';
import AnalyticsNav from '../../../../../components/tinycms/analytics/AnalyticsNav';
import { findSetting } from '../../../../../lib/utils';
import { getOrgSettings } from '../../../../../lib/articles.js';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-2/3 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function SessionsOverview(props) {
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

  const setDates = (sd, ed) => {
    setStartDate(sd);
    setEndDate(ed);
  };

  return (
    <AdminLayout host={props.host} siteUrl={props.siteUrl}>
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
              <Header>Analytics: Sessions Overview</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                Sessions are a core metric for understanding your audience. When
                a user arrives on your page, that begins a session. As they
                navigate around the page, they may view many pages, but they all
                comprise a single session.
              </p>
              <p tw="p-2">
                On this page, track how many sessions you are receiving every
                day, where those sessions are coming from geographically, how
                long those sessions are, and the referral source.
              </p>
              <p tw="p-2">
                Referral source identifies where your users came from on the
                internet. Did they enter your URL in their address bar? That's a
                "direct" referral. If they clicked on a link from somewhere
                else, the referral source is the site that hosted the link.
              </p>
            </AnalyticsSidebar>

            <DateRangePickerWrapper
              startDate={startDate}
              endDate={endDate}
              setDates={setDates}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />

            <DailySessions
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
            />

            <GeoSessions
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
            />

            <AverageSessionDuration
              viewID={viewID}
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
            />

            <ReferralSource
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
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');

  const host = context.req.headers.host; // will give you localhost:3000

  return {
    props: {
      apiUrl,
      site,
      siteUrl,
      host,
    },
  };
}
