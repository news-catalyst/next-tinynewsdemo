import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraListHomepageLayoutSchemas } from '../../../../../lib/homepage.js';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import { getOrgSettings } from '../../../../../lib/articles.js';
import { findSetting } from '../../../../../lib/utils';

export default function HomepageLayouts({ homepageLayouts, siteUrl, host }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated homepage layout.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created homepage layout.');
    }
  }, [action]);

  const listItems = homepageLayouts.map((homepageLayout) => {
    return (
      <li key={homepageLayout.id}>
        <Link
          key={`${homepageLayout.id}-link`}
          href={`/tinycms/homepage-layouts/${homepageLayout.id}`}
        >
          <a>{homepageLayout.name}</a>
        </Link>
      </li>
    );
  });

  return (
    <AdminLayout host={host} siteUrl={siteUrl}>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <h1 className="title">Homepage Layouts</h1>

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>

        <section className="section">
          <Link href="/tinycms/homepage-layouts/add">
            <a>
              <button className="button">Add Homepage Layout</button>
            </a>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');
  const host = context.req.headers.host;

  const { errors, data } = await hasuraListHomepageLayoutSchemas({
    url: apiUrl,
    site: site,
  });

  let homepageLayouts;
  if (errors) {
    throw errors;
  } else {
    homepageLayouts = data.homepage_layout_schemas;
  }

  return {
    props: {
      homepageLayouts: homepageLayouts,
      siteUrl: siteUrl,
      host: host,
    },
  };
}
