import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AnalyticsNav from '../../../components/tinycms/analytics/AnalyticsNav';
import AnalyticsSidebar from '../../../components/tinycms/analytics/AnalyticsSidebar';

export default function AnalyticsIndex(props) {
  const [isSignedIn, setIsSignedIn] = useState(false);

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
      <div className="analytics">
        {!isSignedIn ? (
          <div id="signin-button"></div>
        ) : (
          <section className="section">
            <h1 className="title">Analytics</h1>

            <div className="columns">
              <div className="column">
                <AnalyticsNav />
              </div>

              <div className="column">
                <AnalyticsSidebar title="About this Data">
                  <p className="content">
                    tinycms analytics data is meant to reveal insights about how
                    your audience is - or is not - interacting with your
                    published content.
                  </p>
                  <p className="content">
                    Information related to donate button clicks, page views,
                    reading behavior and sessions come from{' '}
                    <a href="https://analytics.google.com/">Google Analytics</a>
                    . This site is configured for GA as follows:
                  </p>

                  <ul className="content">
                    <li>
                      <b>Tracking ID:</b>{' '}
                      <code>{process.env.NEXT_PUBLIC_GA_TRACKING_ID}</code>
                    </li>
                    <li>
                      <b>View ID:</b>{' '}
                      <code>{process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID}</code>
                    </li>
                  </ul>

                  <p className="content">
                    Information on newsletter subscriptions come from{' '}
                    <a href="https://mailchimp.com/">Mailchimp</a>. This site is
                    configured for Mailchimp with a <b>subscribe URL</b>
                    of:
                  </p>
                  <p className="content">
                    <code>
                      {process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL}
                    </code>
                  </p>
                  <p className="content">
                    For a deeper dive on understanding your audience and
                    measuring the impact of your reporting, News Catalyst
                    recommends checking out{' '}
                    <a href="https://source.opennews.org/articles/memberkit-upgrade-your-analytics/">
                      MemberKit
                    </a>
                    .
                  </p>
                </AnalyticsSidebar>
              </div>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const clientID = process.env.ANALYTICS_CLIENT_ID;
  const clientSecret = process.env.ANALYTICS_CLIENT_SECRET;

  return {
    props: {
      clientID: clientID,
      clientSecret: clientSecret,
    },
  };
}
