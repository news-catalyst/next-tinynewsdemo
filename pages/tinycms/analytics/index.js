import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { addDays } from 'date-fns';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';
import YesterdaysSessions from '../../../components/tinycms/analytics/YesterdaysSessions';
import YesterdaysNewsletter from '../../../components/tinycms/analytics/YesterdaysNewsletter';

const Container = tw.div`flex flex-wrap -mx-2 mb-8`;
const Sidebar = tw.div`h-full h-screen bg-gray-100 md:w-1/5 lg:w-1/5 px-2 mb-4`;
const SidebarHeading = tw.h1`font-bold`;
const LightSidebar = tw.div`bg-gray-100 text-black p-2`;
const MainContent = tw.div`w-full lg:w-1/2 px-2`;
const SettingsContainer = tw.div`min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible p-2`;
const HeaderContainer = tw.div`pt-5 pb-10`;
const Header = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;

export default function AnalyticsIndex(props) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );

  const initAuth = () => {
    return window.gapi.auth2.init({
      client_id: props.clientID, //paste your client ID here
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
    });
  };

  const checkSignedIn = () => {
    return new Promise((resolve, reject) => {
      initAuth() //calls the previous function
        .then(() => {
          const auth = window.gapi.auth2.getAuthInstance(); //returns the GoogleAuth object
          resolve(auth.isSignedIn.get()); //returns whether the current user is currently signed in
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const renderButton = () => {
    window.gapi.signin2.render('signin-button', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  const onSuccess = (googleUser) => {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  };

  const onFailure = (error) => {
    console.error(error);
  };

  const updateSignin = (signedIn) => {
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const init = () => {
    //(2)
    checkSignedIn()
      .then((signedIn) => {
        updateSignin(signedIn);
      })
      .catch((error) => {
        console.log('checkSignedIn error: ', error);
        console.error(error);
      });
  };

  useEffect(() => {
    window.gapi.load('auth2', init); //(1)
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />
      <Container>
        <Sidebar>
          <LightSidebar>
            <SidebarHeading>Navigation</SidebarHeading>
            <AnalyticsNav />
          </LightSidebar>
        </Sidebar>
        <MainContent>
          {!isSignedIn ? (
            <div id="signin-button"></div>
          ) : (
            <SettingsContainer>
              <HeaderContainer>
                <Header>Analytics</Header>
              </HeaderContainer>
              <AnalyticsSidebar title="Yesterday">
                <YesterdaysSessions viewID={viewID} />
                <YesterdaysNewsletter subscriberCount={props.newSubscribers} />
              </AnalyticsSidebar>
              <AnalyticsSidebar title="About this Data">
                <p tw="p-2">
                  tinycms analytics data is meant to reveal insights about how
                  your audience is - or is not - interacting with your published
                  content.
                </p>
                <p tw="p-2">
                  Information related to donate button clicks, page views,
                  reading behavior and sessions come from{' '}
                  <a href="https://analytics.google.com/">Google Analytics</a>.
                  This site is configured for GA as follows:
                </p>

                <ul tw="p-2">
                  <li>
                    <b>Tracking ID:</b>{' '}
                    <code>{process.env.NEXT_PUBLIC_GA_TRACKING_ID}</code>
                  </li>
                  <li>
                    <b>View ID:</b>{' '}
                    <code>{process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID}</code>
                  </li>
                </ul>

                <p tw="p-2">
                  Information on newsletter subscriptions come from{' '}
                  <a href="https://mailchimp.com/">Mailchimp</a>. This site is
                  configured for Mailchimp with a <b>subscribe URL</b>
                  of:
                </p>
                <p tw="p-2">
                  <code>{process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL}</code>
                </p>
                <p tw="p-2">
                  For a deeper dive on understanding your audience and measuring
                  the impact of your reporting, News Catalyst recommends
                  checking out{' '}
                  <a href="https://source.opennews.org/articles/memberkit-upgrade-your-analytics/">
                    MemberKit
                  </a>
                  .
                </p>
              </AnalyticsSidebar>
            </SettingsContainer>
          )}
        </MainContent>
      </Container>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const clientID = process.env.ANALYTICS_CLIENT_ID;
  const clientSecret = process.env.ANALYTICS_CLIENT_SECRET;
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpServer = process.env.MAILCHIMP_SERVER_PREFIX;

  // I tried doing this call in the component's useEffect, but Mailchimp's API
  // throws a CORS error when I try that :(
  mailchimp.setConfig({
    apiKey: mailchimpApiKey,
    server: mailchimpServer,
  });

  // tally the number of subscribers for all lists in the last 24 hours
  // so far in our example setup there is only one list, and I'm not sure if
  // we'll be dealing with multiple lists, so I thought I'd iterate just in case.
  let newSubscribers = 0;
  let sinceDate = addDays(new Date(), -1); // yesterday
  mailchimp.lists.getAllLists().then((response) => {
    response.lists.map((list) => {
      mailchimp.lists
        .getListMembersInfo(list.id, {
          status: 'subscribed',
          sinceTimestampOpt: sinceDate,
        })
        .then((res) => {
          newSubscribers += res.total_items;
        })
        .catch((error) => console.error(error.message));
    });
  });

  return {
    props: {
      clientID: clientID,
      clientSecret: clientSecret,
      newSubscribers: newSubscribers,
    },
  };
}
