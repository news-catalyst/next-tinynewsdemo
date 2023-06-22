import React from 'react';
import tw from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import AnalyticsNav from '../../../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../../../components/tinycms/analytics/AnalyticsSidebar';
import { hasuraGetYesterday } from '../../../../../lib/analytics';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';
import { sub } from 'date-fns';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function AnalyticsIndex(props) {
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
              <Header>Analytics: Sources</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                <strong>
                  Click a link on the sidebar to view source data.
                </strong>
                <br />
                TinyCMS publishing tools in Google Docs, you can log your
                sources and demographic information about them. Here, we
                aggregate that information so you can keep track of the
                diversity of your sources.
              </p>
            </AnalyticsSidebar>
          </SettingsContainer>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const startDate = sub(new Date(), { months: 1 });
  const endDate = new Date();

  let sessionCount = 0;
  let sessionParams = {
    url: apiUrl,
    site: site,
    startDate: startDate,
    endDate: endDate,
  };
  const { errors, data } = await hasuraGetYesterday(sessionParams);
  if (errors && !data) {
    console.error(errors);
    throw errors;
  }

  let sessions = data.ga_sessions;
  sessions.map((pv) => {
    sessionCount += parseInt(pv.count);
  });

  let pageViews = data.ga_page_views;

  let readingDepth = data.ga_reading_depth;

  let donors = data.donorDimensions;
  let donorSessionCount = 0;
  donors.map((item) => {
    donorSessionCount += parseInt(item.count);
  });
  let subscribers = data.subscriberDimensions;
  let subscriberSessionCount = 0;
  subscribers.map((item) => {
    subscriberSessionCount += parseInt(item.count);
  });

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
  const trackingId = findSetting(settings, 'NEXT_PUBLIC_GA_TRACKING_ID');
  const viewId = findSetting(settings, 'NEXT_PUBLIC_ANALYTICS_VIEW_ID');
  const authorizedEmailDomains = findSetting(
    settings,
    'AUTHORIZED_EMAIL_DOMAINS'
  );
  const host = context.req.headers.host; // will give you localhost:3000

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      pageViews: pageViews,
      readingDepth: readingDepth,
      sessionCount: sessionCount,
      donorSessionCount: donorSessionCount,
      subscriberSessionCount: subscriberSessionCount,
      siteUrl: siteUrl,
      host: host,
      trackingId: trackingId,
      viewId: viewId,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
