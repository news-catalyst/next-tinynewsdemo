import Link from 'next/link';
import React from 'react';
import { hasuraListLocales } from '../../lib/articles.js';
import AdminLayout from '../../components/AdminLayout.js';
import AdminNav from '../../components/nav/AdminNav';
import AdminHeader from '../../components/tinycms/AdminHeader';
import tw from 'twin.macro';

const ListItem = tw.li`px-4`;

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
          <ListItem>
            <Link href="/tinycms/authors">Authors</Link>
          </ListItem>
          <ListItem>
            <Link href="/tinycms/homepage">Homepage Editor</Link>
          </ListItem>
          <ListItem>
            <Link href="/tinycms/homepage-layouts">Homepage Layouts</Link>
          </ListItem>
          <ListItem>
            <Link href="/tinycms/metadata">Metadata</Link>
          </ListItem>
          <ListItem>
            <Link href="/tinycms/sections">Sections</Link>
          </ListItem>
          <ListItem>
            <Link href="/tinycms/tags">Tags</Link>
          </ListItem>
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
