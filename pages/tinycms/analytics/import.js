import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import tw from 'twin.macro';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';
import { hasuraGetDataImports } from '../../../lib/analytics';
import moment from 'moment';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

// const fetcher = (url) => fetch(url).then((res) => res.json())

export default function AnalyticsIndex(props) {
  const [updateKey, setUpdateKey] = useState(Math.random());
  const [startDate, setStartDate] = useState(
    moment().subtract(2, 'days').format('yyyy-MM-DD')
  );
  // const [startDate, setStartDate] = useState(subDays(new Date(), 2));
  const [endDate, setEndDate] = useState(
    moment().subtract(1, 'days').format('yyyy-MM-DD')
  );
  // const [endDate, setEndDate] = useState(subDays(new Date(), 1));
  const [dataImports, setDataImports] = useState([]);

  function triggerImport(event) {
    // let tableName = event.target.value;
    // const { data, error } = useSWR(`/api/data-import/${tableName}`, fetcher);
    if (error) return error;
    if (!data) return data;
  }

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      orgSlug: props.apiToken,
      // startDate: startDate.format('YYYY-MM-DD'),
      // endDate: endDate.format('YYYY-MM-DD'),
    };
    const fetchDataImports = async () => {
      const { errors, data } = await hasuraGetDataImports(params);

      if (errors && !data) {
        console.error(errors);
      }
      // let totalRF = {};
      // data.ga_reading_frequency.map((rf) => {
      //   if (totalRF[rf.category]) {
      //     totalRF[rf.category] += parseInt(rf.count);
      //   } else {
      //     totalRF[rf.category] = parseInt(rf.count);
      //   }
      // });
      setDataImports(data.ga_data_imports);
    };
    fetchDataImports();
  }, [updateKey, props.apiToken, props.apiUrl]);

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
              <Header>Analytics: Data Imports from GA</Header>
            </HeaderContainer>
            {/* <AnalyticsSidebar title="Trigger Import">
                <select onChange={triggerImport}>
                  <option>Select a table</option>
                  <option value="ga_custom_dimensions">
                    ga_custom_dimensions
                  </option>
                  <option value="ga_geo_sessions">ga_geo_sessions</option>
                  <option value="ga_newsletter_impressions">
                    ga_newsletter_impressions
                  </option>
                  <option value="ga_page_views">ga_page_views</option>
                  <option value="ga_reading_depth">ga_reading_depth</option>
                  <option value="ga_reading_frequency">
                    ga_reading_frequency
                  </option>
                  <option value="ga_referral_sessions">
                    ga_referral_sessions
                  </option>
                  <option value="ga_session_duration">
                    ga_session_duration
                  </option>
                  <option value="ga_sessions">ga_sessions</option>
                </select>
              </AnalyticsSidebar> */}
            <AnalyticsSidebar title="Most Recent Imports">
              <table tw="w-full table-auto">
                <thead>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Table
                    </th>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Date
                    </th>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Finished At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataImports.map((di, i) => (
                    <tr key={`data-import-row-${i}`}>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.table_name}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.start_date}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.updated_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

  const googleAnalyticsViewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      clientID: clientID,
      clientSecret: clientSecret,
      googleAnalyticsViewID: googleAnalyticsViewID,
    },
  };
}
