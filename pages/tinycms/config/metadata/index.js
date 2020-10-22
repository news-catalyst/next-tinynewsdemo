import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSiteMetadata } from '../../../../lib/site_metadata.js';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';
import CreateMetadata from '../../../../components/tinycms/CreateSiteMetadata.js';
import UpdateMetadata from '../../../../components/tinycms/UpdateSiteMetadata.js';

export default function Metadata({ apiUrl, apiToken, metadata }) {
  console.log('metadata:', metadata);
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
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
              metadata={metadata}
            />
          )}

          {(metadata === undefined || metadata === null) && (
            <CreateMetadata apiUrl={apiUrl} apiToken={apiToken} />
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;

  let metadata = await getSiteMetadata();
  if (metadata === undefined) {
    metadata = null;
  }
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      metadata: metadata,
    },
  };
}
