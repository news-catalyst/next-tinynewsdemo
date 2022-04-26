import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import tw, { styled } from 'twin.macro';
import {
  findSetting,
  getOrgSettings,
  getOrganizations,
} from '../../../../../lib/settings.js';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';

const Container = tw.div`flex flex-wrap -mx-2`;
const MainContent = tw.div`w-full lg:w-3/4 px-4 py-4`;

export default function AdminSetupIndex({
  organizations,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [orgRows, setOrgRows] = useState([]);

  let orgLinks = [];

  useEffect(() => {
    orgLinks = organizations
      .filter((org) => org.subdomain)
      .map((org) => (
        <tr tw="border" key={org.subdomain}>
          <td tw="p-3">
            <Link href={`/tinycms/admin/${org.subdomain}`} passHref>
              <a>{org.name || org.subdomain}</a>
            </Link>
          </td>
          <td tw="p-3 border">{org.subdomain}</td>
          <td tw="p-3 border">{org.customDomain}</td>
        </tr>
      ));

    setOrgRows(orgLinks);
  }, [organizations]);

  return (
    <AdminLayout
      host={host}
      siteUrl={siteUrl}
      authorizedEmailDomains={authorizedEmailDomains}
    >
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      <Container>
        <MainContent>
          <div tw="px-10 pt-5">
            <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight mb-5">
              Organizations Admin
            </h1>

            <p tw="mx-4 mb-5 px-2">
              Configure an organization's settings for AWS, Facebook, Google
              Analytics, Letterhead, Vercel, and tiny news platform specifics
              like organization name, site URL, API tokens and tinycms
              authentication options.
            </p>

            <table tw="w-full table-auto mx-3">
              <thead>
                <tr tw="border p-3">
                  <th tw="border p-3">Name</th>
                  <th tw="border p-3">Subdomain</th>
                  <th tw="border p-3">Custom Domain</th>
                </tr>
              </thead>
              <tbody>{orgRows}</tbody>
            </table>
          </div>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const { errors, data } = await getOrganizations({
    url: apiUrl,
    adminSecret: adminSecret,
  });

  if (errors) {
    console.error('error:', errors);
    throw errors;
  }

  const organizations = data.organizations;

  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('error:', settingsResult);
    throw settingsResult.errors;
  }

  let settings = settingsResult.data.settings;
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');

  // only NC/TNC staff allowed to admin
  const authorizedEmailDomains = 'newscatalyst.org,tinynewsco.org';

  const host = context.req.headers.host;

  return {
    props: {
      organizations: organizations,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
