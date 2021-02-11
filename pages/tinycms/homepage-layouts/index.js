import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { hasuraListHomepageLayoutSchemas } from '../../../lib/homepage.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';

export default function HomepageLayouts({ homepageLayouts }) {
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
  }, []);

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
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <h1 className="title">Homepage Layouts</h1>

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>

        <section className="section">
          <Link href="/tinycms/homepage-layouts/add">
            <button className="button">Add Homepage Layout</button>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  const { errors, data } = await hasuraListHomepageLayoutSchemas({
    url: apiUrl,
    orgSlug: apiToken,
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
    },
  };
}
