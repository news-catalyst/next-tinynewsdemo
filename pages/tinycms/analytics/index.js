import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import Report from '../../../components/tinycms/analytics/Report';

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
    //(3)
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const init = () => {
    //(2)
    checkSignedIn()
      .then((signedIn) => {
        console.log('init checking if signed in: ', signedIn);
        updateSignin(signedIn);
      })
      .catch((error) => {
        console.log('init got an error: ', error);
        console.error(error);
      });
  };

  useEffect(() => {
    console.log('loading auth2....');
    window.gapi.load('auth2', init); //(1)
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />
      <div className="analytics">
        <section className="section">
          <h1 className="title">Analytics Test</h1>
          <p className="content">
            This page is using a custom function to get data out of Google
            Analytics API v4; it's the bare bones, write everything ourselves
            approach.
          </p>

          <p className="content">
            Alternatively, because I'd prefer not to have to write everything
            from scratch,{' '}
            <a href="/tinycms/analytics/dashboard">here is a dashboard</a> built
            using{' '}
            <a href="https://justinmahar.github.io/react-analytics-charts">
              react-analytics-charts
            </a>
          </p>
        </section>
        {!isSignedIn ? <div id="signin-button"></div> : <Report />}
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
