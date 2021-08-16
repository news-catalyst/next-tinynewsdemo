import React from 'react';
import tw from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';
import YesterdaysTopTen from '../../../components/tinycms/analytics/YesterdaysTopTen';
import { hasuraGetYesterday } from '../../../lib/analytics';
import moment from 'moment';

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
    <AdminLayout>
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
              <Header>Analytics</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="Yesterday">
              <table tw="w-full table-auto">
                <tbody>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      Sessions
                    </th>
                    <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      {props.sessionCount}
                    </td>
                  </tr>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      Donor Sessions
                    </th>
                    <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      {props.donorSessionCount}
                    </td>
                  </tr>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      Subscriber Sessions
                    </th>
                    <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      {props.subscriberSessionCount}
                    </td>
                  </tr>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      New Subscribers
                    </th>
                    <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                      TK from Letterhead
                    </td>
                  </tr>
                </tbody>
              </table>
              <YesterdaysTopTen
                pageViews={props.pageViews}
                readingDepth={props.readingDepth}
              />
            </AnalyticsSidebar>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                tinycms analytics data is meant to reveal insights about how
                your audience is - or is not - interacting with your published
                content.
              </p>
              <p tw="p-2">
                Information related to donate button clicks, page views, reading
                behavior and sessions come from{' '}
                <a href="https://analytics.google.com/">Google Analytics</a>.
                This site is configured for GA as follows:
              </p>

              <ul tw="p-2">
                <li>
                  <b>Tracking ID:</b>{' '}
                  <code>{process.env.NEXT_PUBLIC_GA_TRACKING_ID}</code>
                </li>
                <li>
                  <b>View ID:</b>{' '}
                  <code>{process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID}</code>
                </li>
              </ul>

              <p tw="p-2">
                Information on newsletter subscriptions come from{' '}
                <a href="https://tryletterhead.com/">Letterhead</a>.
              </p>
              <p tw="p-2">
                For a deeper dive on understanding your audience and measuring
                the impact of your reporting, News Catalyst recommends checking
                out{' '}
                <a href="https://source.opennews.org/articles/memberkit-upgrade-your-analytics/">
                  MemberKit
                </a>
                .
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
  const apiToken = process.env.ORG_SLUG;
  const clientID = process.env.ANALYTICS_CLIENT_ID;
  const clientSecret = process.env.ANALYTICS_CLIENT_SECRET;

  const startDate = moment().subtract(1, 'days');
  const endDate = moment();

  let sessionCount = 0;
  let sessionParams = {
    url: apiUrl,
    orgSlug: apiToken,
    startDate: startDate,
    endDate: endDate,
  };
  const { errors, data } = await hasuraGetYesterday(sessionParams);
  if (errors && !data) {
    console.error(errors);
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

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      clientID: clientID,
      clientSecret: clientSecret,
      pageViews: pageViews,
      readingDepth: readingDepth,
      sessionCount: sessionCount,
      donorSessionCount: donorSessionCount,
      subscriberSessionCount: subscriberSessionCount,
    },
  };
}
