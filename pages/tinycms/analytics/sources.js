import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import moment from 'moment';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';
import SourcesByAge from '../../../components/tinycms/analytics/SourcesByAge';
import SourcesByRace from '../../../components/tinycms/analytics/SourcesByRace';
import SourcesByEthnicity from '../../../components/tinycms/analytics/SourcesByEthnicity';
import SourcesByGender from '../../../components/tinycms/analytics/SourcesByGender';
import SourcesBySexualOrientation from '../../../components/tinycms/analytics/SourcesBySexualOrientation';
import SourceTopZips from '../../../components/tinycms/analytics/SourceTopZips';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-2/3 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function SourcesOverview(props) {
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
              <Header>Analytics: Sources Overview</Header>
            </HeaderContainer>
            <AnalyticsSidebar title="About this Data">
              <p tw="p-2">tk</p>
            </AnalyticsSidebar>

            <DateRangePickerWrapper
              startDate={startDate}
              endDate={endDate}
              setDates={setDates}
              focusedInput={focusedInput}
              setFocusedInput={setFocusedInput}
            />

            <SourcesByAge
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <SourcesByRace
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <SourcesByEthnicity
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <SourcesByGender
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <SourcesBySexualOrientation
              startDate={startDate}
              endDate={endDate}
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
            />

            <SourceTopZips
              startDate={startDate}
              endDate={endDate}
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

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      clientID: clientID,
      clientSecret: clientSecret,
    },
  };
}