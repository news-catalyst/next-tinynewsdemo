import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import tw from 'twin.macro';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import SitePaymentOptions from '../../../components/tinycms/SitePaymentOptions';
import { hasuraUpsertMetadata } from '../../../lib/site_metadata';
import Notification from '../../../components/tinycms/Notification';

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

export default function PaymentOptions({
  apiUrl,
  apiToken,
  tinyApiKey,
  currentLocale,
  siteMetadata,
  locales,
  awsConfig,
  vercelHook,
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
    if (siteMetadata) {
      let md = siteMetadata.site_metadata_translations[0].data;
      setMetadata(md);
      let parsed = md;
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
      setMessage('Successfully updated payment options.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created payment options.');
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
      orgSlug: apiToken,
      data: parsed,
      published: true,
      localeCode: currentLocale,
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
            'Successfully saved payment options, republishing the site!'
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
    <AdminLayout>
      <AdminNav
        switchLocales={true}
        currentLocale={currentLocale}
        locales={locales}
        homePageEditor={false}
        showConfigOptions={true}
      />

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
                  <Link href="/tinycms/payment-options">
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
              <SitePaymentOptions
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
                currentLocale={currentLocale}
                apiUrl={apiUrl}
                apiToken={apiToken}
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
  const apiToken = process.env.ORG_SLUG;
  const tinyApiKey = process.env.TINYMCE_API_KEY;

  let siteMetadata;
  let locales;

  const { errors, data } = await hasuraGetMetadataByLocale({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: context.locale,
  });

  if (errors) {
    console.error('Error getting site metadata:', errors);
    throw errors;
  } else {
    locales = data.organization_locales;
    siteMetadata = data.site_metadatas[0];
  }
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }

  const awsConfig = {
    bucketName: process.env.TNC_AWS_BUCKET_NAME,
    dirName: process.env.TNC_AWS_DIR_NAME,
    region: process.env.TNC_AWS_REGION,
    accessKeyId: process.env.TNC_AWS_ACCESS_ID,
    secretAccessKey: process.env.TNC_AWS_ACCESS_KEY,
    s3Url: `https://${process.env.TNC_AWS_BUCKET_NAME}.s3.${process.env.TNC_AWS_REGION}.amazonaws.com`,
  };

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      tinyApiKey: tinyApiKey,
      currentLocale: context.locale,
      siteMetadata: siteMetadata,
      locales: locales,
      awsConfig: awsConfig,
      vercelHook: process.env.VERCEL_DEPLOY_HOOK,
    },
  };
}
