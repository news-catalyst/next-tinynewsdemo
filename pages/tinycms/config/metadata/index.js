import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSiteMetadata } from '../../../../lib/site_metadata.js';
import { listAllLocales } from '../../../../lib/articles.js';
import { cachedContents } from '../../../../lib/cached';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';
import CreateMetadata from '../../../../components/tinycms/CreateSiteMetadata.js';
import UpdateMetadata from '../../../../components/tinycms/UpdateSiteMetadata.js';
import { localiseText } from '../../../../lib/utils.js';
// import { localiseText } from '../../../lib/utils.js';

export default function Metadata({
  apiUrl,
  apiToken,
  currentLocale,
  siteMetadata,
}) {
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (siteMetadata) {
      console.log('siteMetadata:', siteMetadata);
      setMetadata(siteMetadata);
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
        <h1 className="title">Site Metadata</h1>

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
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  const apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

  let siteMetadata = await getSiteMetadata(apiUrl, apiToken, currentLocale);
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: currentLocale,
      siteMetadata: siteMetadata,
    },
  };
}
