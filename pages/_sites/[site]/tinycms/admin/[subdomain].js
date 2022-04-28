import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import {
  findSetting,
  getOrgSettings,
  insertSettings,
} from '../../../../../lib/settings.js';
import AdminLayout from '../../../../../components/AdminLayout.js';
import AdminNav from '../../../../../components/nav/AdminNav';
import {
  TinyInputField,
  TinyTextArea,
} from '../../../../../components/tinycms/TinyFormElements';

import Notification from '../../../../../components/tinycms/Notification';
import {
  AddButton,
  PlainButton,
} from '../../../../../components/common/CommonStyles.js';
import { setConfig } from 'next/config';

const Container = tw.div`flex flex-wrap -mx-2`;
const MainContent = tw.div`w-full lg:w-3/4 px-4 py-4`;

export default function AdminSetup({
  apiUrl,
  settings,
  site,
  subdomain,
  siteUrl,
  host,
  authorizedEmailDomains,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [airbrakeProjectId, setAirbrakeProjectId] = useState('');
  const [airbrakeProjectKey, setAirbrakeProjectKey] = useState('');
  const [analyticsClientId, setAnalyticsClientId] = useState('');
  const [analyticsClientSecret, setAnalyticsClientSecret] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [cypressApiToken, setCypressApiToken] = useState('');
  //GA_ACCOUNT_ID
  const [gaAccountId, setGaAccountId] = useState('');
  const [dbAuthorizedEmailDomains, setDbAuthorizedEmailDomains] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [gitRepo, setGitRepo] = useState('');
  const [
    googleCredentialsPrivateKey,
    setGoogleCredentialsPrivateKey,
  ] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [googleCredentialsEmail, setGoogleCredentialsEmail] = useState('');
  const [letterheadApiKey, setLetterheadApiKey] = useState('');
  const [letterheadApiUrl, setLetterheadApiUrl] = useState('');
  const [letterheadChannelSlug, setLetterheadChannelSlug] = useState('');
  const [analyticsViewId, setAnalyticsViewId] = useState('');
  const [analyticsTrackingId, setAnalyticsTrackingId] = useState('');
  const [dbSiteUrl, setDbSiteUrl] = useState('');
  const [orgName, setOrgName] = useState('');
  const [previewToken, setPreviewToken] = useState('');
  const [tinymceApiKey, setTinyMceApiKey] = useState('');
  const [awsAccessId, setAwsAccessId] = useState('');
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsDirName, setAwsDirName] = useState('');
  const [awsRegion, setAwsRegion] = useState('');
  const [awsBucketName, setAwsBucketName] = useState('');
  const [vercelToken, setVercelToken] = useState('');
  const [vercelDeployHook, setVercelDeployHook] = useState('');
  const [fbAppId, setFbAppId] = useState('');
  const [fbClientToken, setFbClientToken] = useState('');
  const [monkeypodUrl, setMonkeypodUrl] = useState('');
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  const [configureSite, setConfigureSite] = useState(subdomain);

  // const router = useRouter();
  // const { action } = router.query;

  useEffect(() => {
    if (subdomain) {
      setConfigureSite(subdomain);
    }
    if (settings) {
      if (findSetting(settings, 'AIRBRAKE_PROJECT_ID')) {
        setAirbrakeProjectId(findSetting(settings, 'AIRBRAKE_PROJECT_ID'));
      }

      if (findSetting(settings, 'AIRBRAKE_PROJECT_KEY')) {
        setAirbrakeProjectKey(findSetting(settings, 'AIRBRAKE_PROJECT_KEY'));
      }

      if (findSetting(settings, 'ANALYTICS_CLIENT_ID')) {
        setAnalyticsClientId(findSetting(settings, 'ANALYTICS_CLIENT_ID'));
      }

      if (findSetting(settings, 'ANALYTICS_CLIENT_SECRET')) {
        setAnalyticsClientSecret(
          findSetting(settings, 'ANALYTICS_CLIENT_SECRET')
        );
      }

      if (findSetting(settings, 'GA_ACCOUNT_ID')) {
        setGaAccountId(findSetting(settings, 'GA_ACCOUNT_ID'));
      }

      if (findSetting(settings, 'NEXT_PUBLIC_ANALYTICS_VIEW_ID')) {
        setAnalyticsViewId(
          findSetting(settings, 'NEXT_PUBLIC_ANALYTICS_VIEW_ID')
        );
      }

      if (findSetting(settings, 'NEXT_PUBLIC_GA_TRACKING_ID')) {
        setAnalyticsTrackingId(
          findSetting(settings, 'NEXT_PUBLIC_GA_TRACKING_ID')
        );
      }

      if (findSetting(settings, 'NEXT_PUBLIC_FB_APP_ID')) {
        setAnalyticsTrackingId(findSetting(settings, 'NEXT_PUBLIC_FB_APP_ID'));
      }

      if (findSetting(settings, 'NEXT_PUBLIC_FB_CLIENT_TOKEN')) {
        setAnalyticsTrackingId(
          findSetting(settings, 'NEXT_PUBLIC_FB_CLIENT_TOKEN')
        );
      }

      if (findSetting(settings, 'API_TOKEN')) {
        setApiToken(findSetting(settings, 'API_TOKEN'));
        setCypressApiToken(findSetting(settings, 'API_TOKEN'));
      }

      if (findSetting(settings, 'GOOGLE_CLIENT_ID')) {
        setGoogleClientId(findSetting(settings, 'GOOGLE_CLIENT_ID'));
      }

      if (findSetting(settings, 'GOOGLE_CLIENT_SECRET')) {
        setGoogleClientSecret(findSetting(settings, 'GOOGLE_CLIENT_SECRET'));
      }

      if (findSetting(settings, 'GOOGLE_CREDENTIALS_EMAIL')) {
        setGoogleCredentialsEmail(
          findSetting(settings, 'GOOGLE_CREDENTIALS_EMAIL')
        );
      }

      if (findSetting(settings, 'GOOGLE_CREDENTIALS_PRIVATE_KEY')) {
        setGoogleCredentialsPrivateKey(
          findSetting(settings, 'GOOGLE_CREDENTIALS_PRIVATE_KEY')
        );
      }

      if (findSetting(settings, 'PREVIEW_TOKEN')) {
        setPreviewToken(findSetting(settings, 'PREVIEW_TOKEN'));
      }

      if (findSetting(settings, 'GIT_REPO')) {
        setGitRepo(findSetting(settings, 'GIT_REPO'));
      }

      if (findSetting(settings, 'GITHUB_TOKEN')) {
        setGithubToken(findSetting(settings, 'GITHUB_TOKEN'));
      }

      if (findSetting(settings, 'LETTERHEAD_API_KEY')) {
        setLetterheadApiKey(findSetting(settings, 'LETTERHEAD_API_KEY'));
      }
      if (findSetting(settings, 'LETTERHEAD_API_URL')) {
        setLetterheadApiUrl(findSetting(settings, 'LETTERHEAD_API_URL'));
      }
      if (findSetting(settings, 'LETTERHEAD_CHANNEL_SLUG')) {
        setLetterheadChannelSlug(
          findSetting(settings, 'LETTERHEAD_CHANNEL_SLUG')
        );
      }
      if (findSetting(settings, 'ORG_NAME')) {
        setOrgName(findSetting(settings, 'ORG_NAME'));
      }
      if (findSetting(settings, 'AUTHORIZED_EMAIL_DOMAINS')) {
        setDbAuthorizedEmailDomains(
          findSetting(settings, 'AUTHORIZED_EMAIL_DOMAINS')
        );
      }
      if (findSetting(settings, 'TINYMCE_API_KEY')) {
        setTinyMceApiKey(findSetting(settings, 'TINYMCE_API_KEY'));
      }
      if (findSetting(settings, 'TNC_AWS_ACCESS_ID')) {
        setAwsAccessId(findSetting(settings, 'TNC_AWS_ACCESS_ID'));
      }
      if (findSetting(settings, 'TNC_AWS_ACCESS_KEY')) {
        setAwsAccessKey(findSetting(settings, 'TNC_AWS_ACCESS_KEY'));
      }
      if (findSetting(settings, 'TNC_AWS_BUCKET_NAME')) {
        setAwsBucketName(findSetting(settings, 'TNC_AWS_BUCKET_NAME'));
      }
      if (findSetting(settings, 'TNC_AWS_REGION')) {
        setAwsRegion(findSetting(settings, 'TNC_AWS_REGION'));
      }
      if (findSetting(settings, 'TNC_AWS_DIR_NAME')) {
        setAwsDirName(findSetting(settings, 'TNC_AWS_DIR_NAME'));
      }
      if (findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL')) {
        setMonkeypodUrl(findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL'));
      }
      if (findSetting(settings, 'STRIPE_SECRET_KEY')) {
        setStripeSecretKey(findSetting(settings, 'STRIPE_SECRET_KEY'));
      }
      if (findSetting(settings, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')) {
        setStripePublishableKey(
          findSetting(settings, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        );
      }
      if (findSetting(settings, 'STRIPE_WEBHOOK_SECRET')) {
        setStripeWebhookSecret(findSetting(settings, 'STRIPE_WEBHOOK_SECRET'));
      }
      if (findSetting(settings, 'VERCEL_DEPLOY_HOOK')) {
        setVercelDeployHook(findSetting(settings, 'VERCEL_DEPLOY_HOOK'));
      }
      if (findSetting(settings, 'VERCEL_TOKEN')) {
        setVercelToken(findSetting(settings, 'VERCEL_TOKEN'));
      }
      if (findSetting(settings, 'NEXT_PUBLIC_SITE_URL')) {
        setDbSiteUrl(findSetting(settings, 'NEXT_PUBLIC_SITE_URL'));
      }
    }
  }, [settings]);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let settingsObjects = [
      {
        name: 'GIT_REPO',
        value: gitRepo,
      },
      {
        name: 'GITHUB_TOKEN',
        value: githubToken,
      },
      {
        name: 'LETTERHEAD_API_KEY',
        value: letterheadApiKey,
      },
      {
        name: 'LETTERHEAD_API_URL',
        value: letterheadApiUrl,
      },
      {
        name: 'LETTERHEAD_CHANNEL_SLUG',
        value: letterheadChannelSlug,
      },
      {
        name: 'ORG_NAME',
        value: orgName,
      },
      {
        name: 'AUTHORIZED_EMAIL_DOMAINS',
        value: dbAuthorizedEmailDomains,
      },
      {
        name: 'TINYMCE_API_KEY',
        value: tinymceApiKey,
      },
      {
        name: 'NEXT_PUBLIC_SITE_URL',
        value: dbSiteUrl,
      },
      {
        name: 'AIRBRAKE_PROJECT_ID',
        value: airbrakeProjectId,
      },
      {
        name: 'AIRBRAKE_PROJECT_KEY',
        value: airbrakeProjectKey,
      },
      {
        name: 'ANALYTICS_CLIENT_ID',
        value: analyticsClientId,
      },
      {
        name: 'ANALYTICS_CLIENT_SECRET',
        value: analyticsClientSecret,
      },
      {
        name: 'GA_ACCOUNT_ID',
        value: gaAccountId,
      },
      {
        name: 'NEXT_PUBLIC_ANALYTICS_VIEW_ID',
        value: analyticsViewId,
      },
      {
        name: 'NEXT_PUBLIC_GA_TRACKING_ID',
        value: analyticsTrackingId,
      },
      {
        name: 'NEXT_PUBLIC_FB_APP_ID',
        value: fbAppId,
      },
      {
        name: 'NEXT_PUBLIC_FB_CLIENT_TOKEN',
        value: fbClientToken,
      },
      {
        name: 'API_TOKEN',
        value: apiToken,
      },
      {
        name: 'CYPRESS_API_TOKEN',
        value: cypressApiToken,
      },
      {
        name: 'GOOGLE_CLIENT_ID',
        value: googleClientId,
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        value: googleClientSecret,
      },
      {
        name: 'GOOGLE_CREDENTIALS_EMAIL',
        value: googleCredentialsEmail,
      },
      {
        name: 'GOOGLE_CREDENTIALS_PRIVATE_KEY',
        value: googleCredentialsPrivateKey,
      },
      {
        name: 'PREVIEW_TOKEN',
        value: previewToken,
      },
      {
        name: 'TNC_AWS_ACCESS_ID',
        value: awsAccessId,
      },
      {
        name: 'TNC_AWS_ACCESS_KEY',
        value: awsAccessKey,
      },
      {
        name: 'TNC_AWS_BUCKET_NAME',
        value: awsBucketName,
      },
      {
        name: 'TNC_AWS_REGION',
        value: awsRegion,
      },
      {
        name: 'TNC_AWS_DIR_NAME',
        value: awsDirName,
      },
      {
        name: 'NEXT_PUBLIC_MONKEYPOD_URL',
        value: monkeypodUrl,
      },
      {
        name: 'STRIPE_SECRET_KEY',
        value: stripeSecretKey,
      },
      {
        name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        value: stripePublishableKey,
      },
      {
        name: 'STRIPE_WEBHOOK_SECRET',
        value: stripeWebhookSecret,
      },
      {
        name: 'VERCEL_DEPLOY_HOOK',
        value: vercelDeployHook,
      },
      {
        name: 'VERCEL_TOKEN',
        value: vercelToken,
      },
    ];

    let params = {
      url: apiUrl,
      site: configureSite,
      settings: settingsObjects,
    };

    const { errors, data } = await insertSettings(params);

    if (errors) {
      console.error(errors);
      setNotificationMessage(JSON.stringify(errors));
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // display success message
      setNotificationMessage('Updated settings.');
      setNotificationType('success');
      setShowNotification(true);
    }

    window.scrollTo(0, 0);
  }
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
            <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
              Edit Organization Config
            </h1>
          </div>
          <form onSubmit={handleSubmit} className={`settings-form`}>
            {showNotification && (
              <Notification
                message={notificationMessage}
                setShowNotification={setShowNotification}
                notificationType={notificationType}
              />
            )}
            <div tw="flex mb-4 pt-5 pl-10">
              <div tw="w-full space-x-4 space-y-8">
                <table tw="w-full table-auto">
                  <tbody>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Authorized Email Domains (for tinycms login)
                      </th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="dbAuthorizedEmailDomains"
                          value={dbAuthorizedEmailDomains}
                          onChange={(ev) => {
                            setDbAuthorizedEmailDomains(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Organization Name</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="orgName"
                          value={orgName}
                          onChange={(ev) => {
                            setOrgName(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Site URL</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="dbSiteUrl"
                          value={dbSiteUrl}
                          onChange={(ev) => {
                            setDbSiteUrl(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        TinyNewsCo Platform API Token
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="apiToken"
                          value={apiToken}
                          onChange={(ev) => {
                            setApiToken(ev.target.value);
                            setCypressApiToken(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        TinyNewsCo Platform Preview Article/Page Token
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="previewToken"
                          value={previewToken}
                          onChange={(ev) => {
                            setPreviewToken(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Airbrake Project ID</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="airbrakeProjectId"
                          value={airbrakeProjectId}
                          onChange={(ev) => {
                            setAirbrakeProjectId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Airbrake Project Key</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="airbrakeProjectKey"
                          value={airbrakeProjectKey}
                          onChange={(ev) => {
                            setAirbrakeProjectKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">AWS Access Key ID</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="awsAccessId"
                          value={awsAccessId}
                          onChange={(ev) => {
                            setAwsAccessId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">AWS Secret Access Key</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="awsAccessKey"
                          value={awsAccessKey}
                          onChange={(ev) => {
                            setAwsAccessKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">AWS Bucket Name</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="awsBucketName"
                          value={awsBucketName}
                          onChange={(ev) => {
                            setAwsBucketName(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">AWS Folder Name</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="awsDirName"
                          value={awsDirName}
                          onChange={(ev) => {
                            setAwsDirName(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">AWS Region</th>
                      <td tw=" align-middle pt-2">
                        <TinyInputField
                          name="awsRegion"
                          value={awsRegion}
                          onChange={(ev) => {
                            setAwsRegion(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Facebook App ID</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="fbAppId"
                          value={fbAppId}
                          onChange={(ev) => {
                            setFbAppId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Facebook Client Token</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="fbClientToken"
                          value={fbClientToken}
                          onChange={(ev) => {
                            setFbClientToken(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Github Repo</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="gitRepo"
                          value={gitRepo}
                          onChange={(ev) => {
                            setGitRepo(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Github API Token</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="githubToken"
                          value={githubToken}
                          onChange={(ev) => {
                            setGithubToken(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Google Analytics Client ID</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="analyticsClientId"
                          value={analyticsClientId}
                          onChange={(ev) => {
                            setAnalyticsClientId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google Analytics Client Secret
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="analyticsClientSecret"
                          value={analyticsClientSecret}
                          onChange={(ev) => {
                            setAnalyticsClientSecret(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Google Analytics Account ID</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="gaAccountId"
                          value={gaAccountId}
                          onChange={(ev) => {
                            setGaAccountId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Google Analytics Tracking ID</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="analyticsTrackingId"
                          value={analyticsTrackingId}
                          onChange={(ev) => {
                            setAnalyticsTrackingId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Google Analytics View ID</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="analyticsViewId"
                          value={analyticsViewId}
                          onChange={(ev) => {
                            setAnalyticsViewId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google OAuth Client ID (for tinycms login)
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="googleClientId"
                          value={googleClientId}
                          onChange={(ev) => {
                            setGoogleClientId(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google OAuth Client Secret (for tinycms login)
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="googleClientSecret"
                          value={googleClientSecret}
                          onChange={(ev) => {
                            setGoogleClientSecret(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google Credentials Email (for Data Importer Jobs)
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="googleCredentialsEmail"
                          value={googleCredentialsEmail}
                          onChange={(ev) => {
                            setGoogleCredentialsEmail(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google Credentials Private Key (for Data Importer Jobs)
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyTextArea
                          name="googleCredentialsPrivateKey"
                          value={googleCredentialsPrivateKey}
                          onChange={(ev) => {
                            setGoogleCredentialsPrivateKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">
                        Google OAuth Client Secret (for tinycms login)
                      </th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="googleClientSecret"
                          value={googleClientSecret}
                          onChange={(ev) => {
                            setGoogleClientSecret(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>

                    <tr tw="border">
                      <th tw="text-right px-2">Letterhead API Key</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="letterheadApiKey"
                          value={letterheadApiKey}
                          onChange={(ev) => {
                            setLetterheadApiKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Letterhead API URL</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="letterheadApiUrl"
                          value={letterheadApiUrl}
                          onChange={(ev) => {
                            setLetterheadApiUrl(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Letterhead Channel Slug</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="letterheadChannelSlug"
                          value={letterheadChannelSlug}
                          onChange={(ev) => {
                            setLetterheadChannelSlug(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Monkeypod URL</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="monkeypodUrl"
                          value={monkeypodUrl}
                          onChange={(ev) => {
                            setMonkeypodUrl(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Stripe Publishable Key</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="stripePublishableKey"
                          value={stripePublishableKey}
                          onChange={(ev) => {
                            setStripePublishableKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Stripe Secret Key</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="stripeSecretKey"
                          value={stripeSecretKey}
                          onChange={(ev) => {
                            setStripeSecretKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Stripe Webhook Secret</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="stripeWebhookSecret"
                          value={stripeWebhookSecret}
                          onChange={(ev) => {
                            setStripeWebhookSecret(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">TinyMCE API Key</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="tinymceApiKey"
                          value={tinymceApiKey}
                          onChange={(ev) => {
                            setTinyMceApiKey(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Vercel Deploy Hook</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="vercelDeployHook"
                          value={vercelDeployHook}
                          onChange={(ev) => {
                            setVercelDeployHook(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-right px-2">Vercel Token</th>
                      <td tw="align-middle pt-2">
                        <TinyInputField
                          name="vercelToken"
                          value={vercelToken}
                          onChange={(ev) => {
                            setVercelToken(ev.target.value);
                          }}
                        />
                      </td>
                    </tr>
                    <tr tw="border">
                      <th tw="text-center px-4"></th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </MainContent>

        <MainContent>
          <div tw="flex justify-end">
            <AddButton tw="mr-2" onClick={handleSubmit}>
              Save
            </AddButton>
            <PlainButton tw="mr-2">
              <Link href={`/tinycms/admin`} passHref>
                <a>Back to orgs list</a>
              </Link>
            </PlainButton>
          </div>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const subdomain = context.params.subdomain;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: subdomain,
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
      apiUrl: apiUrl,
      site: site,
      subdomain: subdomain,
      settings: settings,
      siteUrl: siteUrl,
      host: host,
      authorizedEmailDomains: authorizedEmailDomains,
    },
  };
}
