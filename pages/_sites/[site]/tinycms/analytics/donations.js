import React, { useState } from 'react';
import tw from 'twin.macro';
import { sub } from 'date-fns';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import CustomDimensions from '../../../../../components/tinycms/analytics/CustomDimensions';
import DateRangePickerWrapper from '../../../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../../../styles/datepicker.js';
import DonateClicks from '../../../../../components/tinycms/analytics/DonateClicks';
import AnalyticsNav from '../../../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../../../components/tinycms/analytics/AnalyticsSidebar';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-2/3 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function Donations(props) {
  const [startDate, setStartDate] = useState(sub(new Date(), { months: 1 }));
  const [endDate, setEndDate] = useState(new Date());

  const [focusedInput, setFocusedInput] = useState(null);

  const setDates = (sd, ed) => {
    sd && setStartDate(sd);
    ed && setEndDate(ed);
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
              <Header>Analytics: Donations Overview</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                Donate button clicks are measured using Google Analytics event
                tracking.
              </p>
              <p tw="p-2">
                Reading frequency is tracked through a custom dimension in
                Google Analytics, and compared against donation activity via the
                article path.
              </p>
            </AnalyticsSidebar>

            <DateRangePickerWrapper
              startDate={startDate}
              endDate={endDate}
              setDates={setDates}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />

            <DonateClicks
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              site={props.site}
            />

            <CustomDimensions
              startDate={startDate}
              endDate={endDate}
              dimension="dimension4"
              label="Donor"
              dek="This chart shows you how many sessions have occurred from users who have already donated to your website. Note: we track this via cookies, meaning a user must use the same browser as when they donated for this to track."
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
      authorizedEmailDomains,
    },
  };
}
