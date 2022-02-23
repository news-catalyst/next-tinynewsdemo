import React, { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import AdminLayout from '../../../../../components/AdminLayout';
import AdminNav from '../../../../../components/nav/AdminNav';
import AnalyticsNav from '../../../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../../../components/tinycms/analytics/AnalyticsSidebar';
import { hasuraGetDataImports } from '../../../../../lib/analytics';
import moment from 'moment';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;
const DataImportRow = styled.tr(({ success }) => [
  tw`px-4 py-3 rounded`,
  success && tw`bg-green-100 border border-green-400 text-green-700`,
  !success && tw`bg-red-100 border border-red-400 text-red-700`,
]);

export default function AnalyticsDashboard(props) {
  const [startDate, setStartDate] = useState(
    moment().subtract(1, 'days').format('yyyy-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('yyyy-MM-DD'));
  const [dataImports, setDataImports] = useState([]);

  useEffect(() => {
    let params = {
      url: props.apiUrl,
      site: props.site,
      start_date: startDate,
      end_date: endDate,
    };
    const fetchDataImports = async () => {
      const { errors, data } = await hasuraGetDataImports(params);

      if (errors && !data) {
        console.error(errors);
      }

      setDataImports(data.ga_data_imports);
    };
    fetchDataImports();
  }, [props.apiToken, props.apiUrl]);

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
            <AnalyticsSidebar title={`From ${startDate} to ${endDate}`}>
              <table tw="w-full table-auto">
                <thead>
                  <tr>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Org
                    </th>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Status
                    </th>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Table
                    </th>
                    <th tw="border border-gray-500 px-4 py-2 text-gray-600 font-bold">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataImports.map((di, i) => (
                    <DataImportRow
                      success={di.success}
                      key={`data-import-row-${i}`}
                    >
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.organization.name}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.success ? 'success' : 'error'}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.table_name}
                      </td>
                      <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                        {di.notes}
                      </td>
                    </DataImportRow>
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
  const site = context.params.site;

  return {
    props: {
      apiUrl: apiUrl,
      site: site,
    },
  };
}
