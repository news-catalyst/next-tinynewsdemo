import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { addDays } from 'date-fns';
import moment from 'moment';
import mailchimp from '@mailchimp/mailchimp_marketing';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import CustomDimensions from '../../../components/tinycms/analytics/CustomDimensions';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';
import DonateClicks from '../../../components/tinycms/analytics/DonateClicks';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-2/3 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function Audience(props) {
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

  const setDates = (sd, ed) => {
    setStartDate(sd);
    setEndDate(ed);
  };

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
              <Header>Analytics: Audience Overview</Header>
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
              <p tw="p-2">
                Sessions by audience segment are all measured using Google
                Analytics custom dimensions and are currently TBD.
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
              apiToken={props.apiToken}
            />

            <CustomDimensions
              startDate={startDate}
              endDate={endDate}
              dimension="dimension4"
              label="Donor"
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <CustomDimensions
              startDate={startDate}
              endDate={endDate}
              dimension="dimension5"
              label="Subscriber"
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
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
  const clientID = process.env.ANALYTICS_CLIENT_ID;
  const clientSecret = process.env.ANALYTICS_CLIENT_SECRET;
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  });

  let fullReports = [];
  let reportsResponse = await mailchimp.reports.getAllCampaignReports({
    since_send_time: addDays(new Date(), -30),
  });
  let report = reportsResponse.reports[0];
  let listId = report.list_id;
  let data = await mailchimp.lists.getListGrowthHistory(listId);
  report['growth'] = data;
  fullReports.push(report);

  return {
    props: {
      apiUrl,
      apiToken,
      clientID: clientID,
      clientSecret: clientSecret,
      mailchimpKey: process.env.MAILCHIMP_API_KEY,
      mailchimpServer: process.env.MAILCHIMP_SERVER_PREFIX,
      reports: fullReports,
    },
  };
}
