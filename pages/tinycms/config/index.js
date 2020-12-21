import Link from 'next/link';
import React from 'react';
import { listAllLocales } from '../../../lib/articles.js';
import { cachedContents } from '../../../lib/cached';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import LocaleSwitcher from '../LocaleSwitcher';

export default function Config(props) {
  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">
                Site Config & Setup ({props.currentLocale.code})
              </h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <LocaleSwitcher
                locales={props.locales}
                currentLocale={props.currentLocale}
              />
            </div>
          </div>
        </div>
        <ul>
          <li>
            <Link href="/tinycms/config/homepage-layouts">
              Homepage Layouts
            </Link>
          </li>
          <li>
            <Link href="/tinycms/authors">Authors</Link>
          </li>
          <li>
            <Link href="/tinycms/config/categories">Categories/Sections</Link>
          </li>
          <li>
            <Link href="/tinycms/metadata">Metadata</Link>
          </li>
          <li>
            <Link href="/tinycms/tags">Tags</Link>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  console.log('getServerSideProps:', context);
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  return {
    props: {
      locales: localeMappings,
      currentLocale: currentLocale,
    },
  };
}
