import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import SiteInfoSettings from '../../../components/tinycms/SiteInfoSettings';
import UpdateMetadata from '../../../components/tinycms/UpdateSiteMetadata.js';
import tw from 'twin.macro';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`w-full md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;

export default function Settings({
  apiUrl,
  apiToken,
  currentLocale,
  siteMetadata,
  locales,
}) {
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (siteMetadata) {
      setMetadata(siteMetadata.site_metadata_translations[0].data);
    }
    if (action && action === 'edit') {
      setMessage('Successfully updated metadata.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created metadata.');
    }
  }, []);

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      <Container>
        <Sidebar>
          <LightSidebar>
            <SidebarHeading>Navigation</SidebarHeading>
            <ul>
              <li>Site Information</li>
              <li>Design</li>
              <li>Newsletter Block</li>
              <li>Membership Block</li>
              <li>SEO/Social</li>
            </ul>
          </LightSidebar>
        </Sidebar>
        <MainContent>
          <SettingsContainer>
            <SiteInfoSettings />
          </SettingsContainer>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let siteMetadata;
  let locales;

  const { errors, data } = await hasuraGetMetadataByLocale({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: context.locale,
  });

  if (errors) {
    throw errors;
  } else {
    locales = data.organization_locales;
    siteMetadata = data.site_metadatas[0];
  }
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      siteMetadata: siteMetadata,
      locales: locales,
    },
  };
}
