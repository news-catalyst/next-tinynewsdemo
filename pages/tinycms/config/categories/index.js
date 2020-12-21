import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAllSections } from '../../../../lib/articles.js';
import AdminLayout from '../../../../components/AdminLayout.js';
import AdminNav from '../../../../components/nav/AdminNav';
import AdminHeader from '../../../../components/tinycms/AdminHeader';
import { localiseText } from '../../../../lib/utils';
import { listAllLocales } from '../../../../lib/articles.js';
import { cachedContents } from '../../../../lib/cached';

export default function Categories({ categories, currentLocale, locales }) {
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
    let title = localiseText(currentLocale, category.title);
    return (
      <li key={category.id}>
        <Link
          key={`${category.id}-link`}
          href={`/tinycms/config/categories/${category.id}`}
        >
          <a>{title}</a>
        </Link>{' '}
        ({category.slug})
      </li>
    );
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Categories"
        />

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

export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  let categories = await listAllSections();
  return {
    props: {
      categories: categories,
      currentLocale: currentLocale,
      locales: localeMappings,
    },
  };
}
