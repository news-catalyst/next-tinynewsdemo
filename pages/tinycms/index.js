import Link from 'next/link';
import React from 'react';
import { listAllLocales } from '../../lib/articles.js';
import { cachedContents } from '../../lib/cached';
import AdminLayout from '../../components/AdminLayout.js';
import AdminNav from '../../components/nav/AdminNav';
import AdminHeader from '../../components/tinycms/AdminHeader';

export default function TinyCmsHome(props) {
  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <AdminHeader
          locales={props.locales}
          currentLocale={props.currentLocale}
          title="tinycms site config"
        />
        <ul>
          <li>
            <Link href="/tinycms/authors">Authors</Link>
          </li>
          <li>
            <Link href="/tinycms/homepage">Homepage Editor</Link>
          </li>
          <li>
            <Link href="/tinycms/homepage-layouts">Homepage Layouts</Link>
          </li>
          <li>
            <Link href="/tinycms/metadata">Metadata</Link>
          </li>
          <li>
            <Link href="/tinycms/sections">Sections</Link>
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
