import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import CreateMetadata from '../../../components/tinycms/CreateSiteMetadata.js';
import UpdateMetadata from '../../../components/tinycms/UpdateSiteMetadata.js';

export default function Metadata({
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
      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Site Metadata"
        />
        {message && <div className="success">{message}</div>}

        <section className="section">
          {metadata !== undefined && metadata !== null && (
            <UpdateMetadata
              apiUrl={apiUrl}
              apiToken={apiToken}
              currentLocale={currentLocale}
              metadata={metadata}
              setMetadata={setMetadata}
            />
          )}

          {(metadata === undefined || metadata === null) && (
            <CreateMetadata
              apiUrl={apiUrl}
              apiToken={apiToken}
              currentLocale={currentLocale}
              metadata={metadata}
              setMetadata={setMetadata}
            />
          )}
        </section>
      </div>
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
