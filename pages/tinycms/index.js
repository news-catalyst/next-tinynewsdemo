import Link from 'next/link';
import React from 'react';
import { hasuraListLocales } from '../../lib/articles.js';
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
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const { errors, data } = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;

  if (errors || !data) {
    console.log('error listing locales:', errors);
    return {
      notFound: true,
    };
  } else {
    locales = data.organization_locales;
  }

  return {
    props: {
      locales: locales,
      currentLocale: context.locale,
    },
  };
}
