import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listLayoutSchemas } from '../../../../lib/homepage.js';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';

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
          href={`/tinycms/config/homepage-layouts/${homepageLayout.id}`}
        >
          <a>{homepageLayout.name}</a>
        </Link>
      </li>
    );
  });

  return (
    <AdminLayout>
      <AdminNav />
      <div id="page">
        <h1 className="title">Homepage Layouts</h1>

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>

        <Link className="button" href="/tinycms/config/homepage-layouts/add">
          Add Homepage Layout
        </Link>
      </div>
    </AdminLayout>
  );
}

export async function getStaticProps() {
  let homepageLayouts = await listLayoutSchemas();
  return {
    props: {
      homepageLayouts: homepageLayouts,
    },
  };
}
