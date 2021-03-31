import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';

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
                <aside className="menu">
                  <p className="menu-label">Sections:</p>
                  <ul className="menu-list">
                    <li>
                      <a href="/tinycms/analytics/audience">Audience</a>
                      <ul>
                        <li>Donations</li>
                        <li>Subscriptions</li>
                      </ul>
                    </li>
                    <li>
                      <a href="/tinycms/analytics/newsletter">Newsletters</a>
                      <ul>
                        <li>Signup Stats</li>
                        <li>Mailchimp Campaigns</li>
                      </ul>
                    </li>
                    <li>
                      <a href="/tinycms/analytics/pageviews">Page Views</a>
                      <ul>
                        <li>Page Views</li>
                        <li>Reading Depth</li>
                        <li>Reading Frequency</li>
                      </ul>
                    </li>
                    <li>
                      <a href="/tinycms/analytics/sessions">Sessions</a>
                      <ul>
                        <li>Daily</li>
                        <li>Regional</li>
                        <li>Referral Sources</li>
                        <li>Time Spent</li>
                      </ul>
                    </li>
                  </ul>
                </aside>
              </div>

              <div className="column">
                <article className="message">
                  <div className="message-header">
                    <p>About this Data</p>
                    <button className="delete" aria-label="delete"></button>
                  </div>
                  <div className="message-body">
                    <p className="content">
                      tinycms analytics data is meant to reveal insights about
                      how your audience is - or is not - interacting with your
                      published content.
                    </p>
                    <p className="content">
                      Information related to donate button clicks, page views,
                      reading behavior and sessions come from Google Analytics.
                      This site is configured for GA as follows:
                      <ul>
                        <li>
                          <b>Tracking ID:</b>{' '}
                          {process.env.NEXT_PUBLIC_GA_TRACKING_ID}
                        </li>
                        <li>
                          <b>View ID:</b>{' '}
                          {process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID}
                        </li>
                      </ul>
                    </p>
                    <p className="content">
                      Information on newsletter subscriptions come from
                      Mailchimp. This site is configured for Mailchimp with a
                      subscribe URL of:{' '}
                      <pre>
                        {process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL}
                      </pre>
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
                  </div>
                </article>
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
