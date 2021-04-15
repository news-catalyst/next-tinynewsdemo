import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import tw from 'twin.macro';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import SiteInfoSettings from '../../../components/tinycms/SiteInfoSettings';
import newsletterStyles from '../../../styles/newsletter.js';
import { hasuraUpsertMetadata } from '../../../lib/site_metadata';
import Notification from '../../../components/tinycms/Notification';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const SaveContainer = tw.div`absolute bottom-0 h-16 w-16`;
const SaveButton = tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded align-bottom`;

export default function Settings({
  apiUrl,
  apiToken,
  currentLocale,
  siteMetadata,
  locales,
}) {
  const siteInfoRef = useRef();
  const designRef = useRef();
  const newsletterRef = useRef();
  const membershipRef = useRef();
  const seoRef = useRef();
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [editData, setEditData] = useState(false);
  const [randomDataKey, setRandomDataKey] = useState(Math.random());

  const router = useRouter();
  const { action } = router.query;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setParsedData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === 'radio') {
      setParsedData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setParsedData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    if (window.location.hash && window.location.hash === '#siteInfo') {
      if (siteInfoRef) {
        console.log('scrolling to siteInfo');
        siteInfoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#design') {
      if (designRef) {
        console.log('scrolling to design');
        designRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#newsletter') {
      if (newsletterRef) {
        console.log('scrolling to newsletter');
        newsletterRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#membership') {
      if (membershipRef) {
        console.log('scrolling to membership');
        membershipRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#seo') {
      if (seoRef) {
        console.log('scrolling to seo');
        seoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (siteMetadata) {
      let md = siteMetadata.site_metadata_translations[0].data;
      setMetadata(md);
      let parsed = md;
      setParsedData(parsed);
      setRandomDataKey(Math.random());
      let formattedJSON = JSON.stringify(parsed, null, 2);
      setJsonData(formattedJSON);
    }
    if (action && action === 'edit') {
      setMessage('Successfully updated metadata.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created metadata.');
    }
  }, []);

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let parsed = parsedData;

    if (jsonData && (Object.keys(parsedData).length === 0 || editData)) {
      parsed = JSON.parse(jsonData);
      setParsedData(parsed);
    }

    console.log('parsedData:', parsed);

    const { errors, data } = await hasuraUpsertMetadata({
      url: apiUrl,
      orgSlug: apiToken,
      data: parsed,
      published: true,
      localeCode: currentLocale,
    });
    if (errors) {
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Successfully saved and published the metadata!');
      setNotificationType('success');
      setShowNotification(true);

      let formattedJSON = JSON.stringify(parsed, null, 2);
      setJsonData(formattedJSON);
      setRandomDataKey(Math.random());
    }
  }
  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      <Container>
        <Sidebar>
          <LightSidebar>
            <SidebarHeading>Navigation</SidebarHeading>
            <ul>
              <li>
                <Link href="/tinycms/settings#siteInfo">
                  <a href="/tinycms/settings#siteInfo">Site Information</a>
                </Link>
              </li>
              <li>
                <Link href="/tinycms/settings#design">
                  <a href="/tinycms/settings#design">Design</a>
                </Link>
              </li>
              <li>
                <Link href="/tinycms/settings#newsletter">
                  <a href="/tinycms/settings#newsletter">Newsletter Block</a>
                </Link>
              </li>
              <li>
                <Link href="/tinycms/settings#membership">
                  <a href="/tinycms/settings#membership">Membership Block</a>
                </Link>
              </li>
              <li>
                <Link href="/tinycms/settings#seo">
                  <a href="/tinycms/settings#seo">SEO/Social</a>
                </Link>
              </li>
            </ul>
            <SaveContainer>
              <SaveButton onClick={handleSubmit}>Save</SaveButton>
            </SaveContainer>
          </LightSidebar>
        </Sidebar>
        <MainContent>
          <form onSubmit={handleSubmit} className={parsedData['color']}>
            {showNotification && (
              <Notification
                message={notificationMessage}
                setShowNotification={setShowNotification}
                notificationType={notificationType}
              />
            )}
            <SettingsContainer>
              <SiteInfoSettings
                siteInfoRef={siteInfoRef}
                seoRef={seoRef}
                newsletterRef={newsletterRef}
                membershipRef={membershipRef}
                designRef={designRef}
                handleChange={handleChange}
                parsedData={parsedData}
              />
            </SettingsContainer>
          </form>
        </MainContent>
      </Container>
      <style jsx global>
        {newsletterStyles}
      </style>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let siteMetadata;
  let locales;

  const { errors, data } = await hasuraGetMetadataByLocale({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: context.locale,
  });

  if (errors) {
    throw errors;
  } else {
    locales = data.organization_locales;
    siteMetadata = data.site_metadatas[0];
  }
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      siteMetadata: siteMetadata,
      locales: locales,
    },
  };
}
