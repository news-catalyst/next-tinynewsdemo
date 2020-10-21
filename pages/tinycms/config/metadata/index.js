import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSiteMetadata } from '../../../../lib/site_metadata.js';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';

export default function Metadata({ metadata }) {
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
      <AdminNav />
      <div id="page">
        <h1 className="title">Site Metadata</h1>

        {message && <div className="success">{message}</div>}

        {metadata !== undefined && metadata !== null && (
          <ul>
            <li key={metadata.id}>
              <Link
                key={`${metadata.id}-link`}
                href={`/tinycms/config/metadata/${metadata.id}`}
              >
                <a>Edit</a>
              </Link>
            </li>
          </ul>
        )}

        {(metadata === undefined || metadata === null) && (
          <section className="section">
            <Link href="/tinycms/config/metadata/add">
              <button className="button">Add Metadata</button>
            </Link>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  let metadata = await getSiteMetadata();
  if (metadata === undefined) {
    metadata = null;
  }
  return {
    props: {
      metadata: metadata,
    },
  };
}
