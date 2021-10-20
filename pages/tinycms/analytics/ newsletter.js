import React, { useState } from 'react';
import tw from 'twin.macro';
import moment from 'moment';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import CustomDimensions from '../../../components/tinycms/analytics/CustomDimensions';
import NewsletterSignupFormData from '../../../components/tinycms/analytics/NewsletterSignupFormData';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';
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

export default function Newsletter(props) {
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
              <Header>Analytics: Newsletter Overview</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">
                Newsletter impressions and signups are measured using Google
                Analytics event tracking.
              </p>
              <p tw="p-2">
                Sessions by audience segment are all measured using Google
                Analytics custom dimension reporting.
              </p>
            </AnalyticsSidebar>

            <DateRangePickerWrapper
              startDate={startDate}
              endDate={endDate}
              setDates={setDates}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />

            <NewsletterSignupFormData
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
              dimension="dimension2"
            />

            <CustomDimensions
              startDate={startDate}
              endDate={endDate}
              dimension="dimension5"
              label="Subscriber"
              dek="This chart shows you have many sessions have occurred from user who have subscribed to your newsletter. Note: we track this via cookies, meaning a user must use the same browser as when they donated for this to track."
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
export async function getServerSideProps() {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  return {
    props: {
      apiUrl,
      apiToken,
    },
  };
}
