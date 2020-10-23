import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAllSections } from '../../../../lib/articles.js';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';

export default function Categories({ categories }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated category.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created category.');
    }
  }, []);

  const listItems = categories.map((category) => {
    return (
      <li key={category.id}>
        <Link
          key={`${category.id}-link`}
          href={`/tinycms/config/categories/${category.id}`}
        >
          <a>{category.title.values[0].value}</a>
        </Link>
      </li>
    );
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <h1 className="title">Categories</h1>

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>

        <section className="section">
          <Link href="/tinycms/config/categories/add">
            <button className="button">Add Category</button>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  let categories = await listAllSections();
  return {
    props: {
      categories: categories,
    },
  };
}
