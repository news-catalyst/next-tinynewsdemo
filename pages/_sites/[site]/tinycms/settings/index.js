import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import tw from 'twin.macro';
import { hasuraGetMetadataByLocale } from '../../../../../lib/articles.js';
import { findSetting, getOrgSettings } from '../../../../../lib/settings.js';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import SiteInfoSettings from '../../../../../components/tinycms/SiteInfoSettings';
import { hasuraUpsertMetadata } from '../../../../../lib/site_metadata';
import Notification from '../../../../../components/tinycms/Notification';

const Container = tw.div`flex flex-wrap -mx-2`;
const Sidebar = tw.div`sticky top-0 h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const SidebarContent = tw.div`mt-6 ml-2`;
const MainContent = tw.div`w-full lg:w-3/4 px-4 py-4`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const SaveContainer = tw.div`absolute bottom-10 h-16 w-72 justify-center`;
const SaveButton = tw.button`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded align-bottom w-56`;

const typographyOptions = {
  styleone: {
    headingFont: 'Libre Franklin',
    bodyFont: 'Domine',
  },
  styletwo: {
    headingFont: 'Source Serif Pro',
    bodyFont: 'Source Sans Pro',
  },
  stylethree: {
    headingFont: 'Roboto Condensed',
    bodyFont: 'Roboto',
  },
  stylefour: {
    headingFont: 'Arbutus Slab',
    bodyFont: 'Mulish',
  },
  stylefive: {
    headingFont: 'Bodoni Moda',
    bodyFont: 'Lato',
  },
};

export default function Settings({
  apiUrl,
  site,
  tinyApiKey,
  siteMetadata,
  awsConfig,
  vercelHook,
  siteUrl,
  host,
}) {
  const siteInfoRef = useRef();
  const designRef = useRef();
  const landingPageRef = useRef();
  const commentsRef = useRef();
  const homepagePromoRef = useRef();
  const newsletterRef = useRef();
  const membershipRef = useRef();
  const advertisingRef = useRef();
  const paymentRef = useRef();
  const seoRef = useRef();
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [editData, setEditData] = useState(false);

  const router = useRouter();
  const { action } = router.query;

  const validateHexColorCode = (value) => {
    let codePattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return codePattern.test(value);
  };

  const validateUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 18) {
      e.preventDefault();
    }
  };
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

    // select typography
    if (name === 'theme') {
      setParsedData((prevState) => ({
        ...prevState,
        headingFont: typographyOptions[value].headingFont,
        bodyFont: typographyOptions[value].bodyFont,
      }));
    }
  };

  useEffect(() => {
    if (window.location.hash && window.location.hash === '#siteInfo') {
      if (siteInfoRef) {
        siteInfoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#comments') {
      if (commentsRef) {
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (
      window.location.hash &&
      window.location.hash === '#landingPage'
    ) {
      if (landingPageRef) {
        landingPageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#design') {
      if (designRef) {
        designRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#newsletter') {
      if (newsletterRef) {
        newsletterRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#membership') {
      if (membershipRef) {
        membershipRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (
      window.location.hash &&
      window.location.hash === '#advertising'
    ) {
      if (advertisingRef) {
        advertisingRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (window.location.hash && window.location.hash === '#seo') {
      if (seoRef) {
        seoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (siteMetadata) {
      setMetadata(siteMetadata);
      let parsed = siteMetadata;
      setParsedData(parsed);
      let formattedJSON;
      try {
        formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
      } catch (error) {
        console.error(error);
      }
    }
    if (action && action === 'edit') {
      setMessage('Successfully updated metadata.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created metadata.');
    }
  }, [action, siteMetadata]);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let parsed = parsedData;

    if (jsonData && (Object.keys(parsedData).length === 0 || editData)) {
      parsed = JSON.parse(jsonData);
      setParsedData(parsed);
    }

    if (
      parsed['primaryColor'] &&
      !validateHexColorCode(parsed['primaryColor'])
    ) {
      setNotificationMessage(
        `Custom primary color '${parsed['primaryColor']}' is not a valid hex color: must start with '#' and include the letters A-F and/or digits 0-9 only.`
      );
      setNotificationType('error');
      setShowNotification(true);
      return false;
    }
    if (
      parsed['secondaryColor'] &&
      !validateHexColorCode(parsed['secondaryColor'])
    ) {
      setNotificationMessage(
        `Custom secondary color '${parsed['primaryColor']}'' is not a valid hex color: must start with '#' and include the letters A-F and/or digits 0-9 only.`
      );
      setNotificationType('error');
      setShowNotification(true);
      return false;
    }
    // ensure founder twitter link is a fully formed url
    if (parsed['founderTwitter'] && !validateUrl(parsed['founderTwitter'])) {
      let prependedUrl = new URL(
        `https://twitter.com/${parsed['founderTwitter']}`
      );
      if (validateUrl(prependedUrl)) {
        parsed['founderTwitter'] = prependedUrl;
      }
    }

    // ensure founder Instagram link is a fully formed url
    if (
      parsed['founderInstagram'] &&
      !validateUrl(parsed['founderInstagram'])
    ) {
      let prependedUrl = new URL(
        `https://instagram.com/${parsed['founderInstagram']}`
      );
      if (validateUrl(prependedUrl)) {
        parsed['founderInstagram'] = prependedUrl;
      }
    }

    // ensure founder Facebook link is a fully formed url
    if (parsed['founderFacebook'] && !validateUrl(parsed['founderFacebook'])) {
      let prependedUrl = new URL(
        `https://facebook.com/${parsed['founderFacebook']}`
      );
      if (validateUrl(prependedUrl)) {
        parsed['founderFacebook'] = prependedUrl;
      }
    }

    const { errors, data } = await hasuraUpsertMetadata({
      url: apiUrl,
      site: site,
      data: parsed,
      published: true,
    });
    if (errors) {
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // rebuild the site
      if (!vercelHook) {
        setNotificationMessage(
          'Successfully saved, but no deploy hook defined so unable to republish the site.'
        );
        setNotificationType('success');
      } else {
        const response = await fetch(vercelHook, {
          method: 'POST',
        });
        const statusCode = response.status;
        const data = await response.json();
        // console.log(statusCode, 'vercel data:', data);
        if (statusCode < 200 || statusCode > 299) {
          setNotificationType('error');
          setNotificationMessage(
            'An error occurred republishing the site: ' + JSON.stringify(data)
          );
        } else {
          setNotificationType('success');
          setNotificationMessage(
            'Successfully saved settings, republishing the site now!'
          );
        }
      }
      setShowNotification(true);

      let formattedJSON;
      try {
        formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <AdminLayout host={host} siteUrl={siteUrl}>
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      <Container>
        <Sidebar>
          <LightSidebar>
            <SidebarContent>
              <SidebarHeading>Navigation</SidebarHeading>
              <ul tw="ml-6">
                <li>
                  <Link href="/tinycms/settings#siteInfo">
                    <a>Site Information</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#landingPage">
                    <a>Landing Page</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#comments">
                    <a>Comments</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#design">
                    <a>Design</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#homepage-promo">
                    <a>Homepage Promo</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#newsletter">
                    <a>Newsletter Block</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#membership">
                    <a>Membership Block</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#advertising">
                    <a>Advertising Block</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#payment-options">
                    <a>Payment options</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tinycms/settings#seo">
                    <a>SEO/Social</a>
                  </Link>
                </li>
              </ul>
              <SaveContainer>
                <SaveButton onClick={handleSubmit}>Save</SaveButton>
              </SaveContainer>
            </SidebarContent>
          </LightSidebar>
        </Sidebar>
        <MainContent>
          <form
            onSubmit={handleSubmit}
            className={`settings-form ${parsedData['color']}`}
          >
            {showNotification && (
              <Notification
                message={notificationMessage}
                setShowNotification={setShowNotification}
                notificationType={notificationType}
              />
            )}
            <SettingsContainer>
              <SiteInfoSettings
                tinyApiKey={tinyApiKey}
                siteInfoRef={siteInfoRef}
                commentsRef={commentsRef}
                landingPageRef={landingPageRef}
                seoRef={seoRef}
                newsletterRef={newsletterRef}
                membershipRef={membershipRef}
                advertisingRef={advertisingRef}
                designRef={designRef}
                homepagePromoRef={homepagePromoRef}
                paymentRef={paymentRef}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                parsedData={parsedData}
                updateParsedData={setParsedData}
                awsConfig={awsConfig}
                setNotificationMessage={setNotificationMessage}
                setNotificationType={setNotificationType}
                setShowNotification={setShowNotification}
              />
            </SettingsContainer>
          </form>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.log('error:', settingsResult);
    throw settingsResult.errors;
  }
  let settings = settingsResult.data.settings;

  let bucketName = findSetting(settings, 'TNC_AWS_BUCKET_NAME');
  let dir = findSetting(settings, 'TNC_AWS_DIR_NAME');
  let region = findSetting(settings, 'TNC_AWS_REGION');
  let accessKey = findSetting(settings, 'TNC_AWS_ACCESS_ID');
  let secretKey = findSetting(settings, 'TNC_AWS_ACCESS_KEY');
  let vercelHook = findSetting(settings, 'VERCEL_DEPLOY_HOOK');
  let tinyApiKey = findSetting(settings, 'TINYMCE_API_KEY');
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');

  const awsConfig = {
    bucketName: bucketName,
    dirName: dir,
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    s3Url: `https://${bucketName}.s3.${region}.amazonaws.com`,
  };

  const host = context.req.headers.host; // will give you localhost:3000

  const { errors, data } = await hasuraGetMetadataByLocale({
    url: apiUrl,
    site: site,
    localeCode: 'en-US',
  });

  let siteMetadata;
  if (errors) {
    console.error('Error getting site metadata:', errors);
    throw errors;
  } else {
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
  }
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }
  return {
    props: {
      apiUrl: apiUrl,
      site: site,
      tinyApiKey: tinyApiKey,
      siteMetadata: siteMetadata,
      awsConfig: awsConfig,
      vercelHook: vercelHook,
      siteUrl: siteUrl,
      host: host,
    },
  };
}
