import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import PageViews from '../../../components/tinycms/analytics/PageViews';
import ReadingDepthData from '../../../components/tinycms/analytics/ReadingDepthData';
import ReadingFrequencyData from '../../../components/tinycms/analytics/ReadingFrequencyData';
import moment from 'moment';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';

export default function PageViewsPage(props) {
  const [pageViews, setPageViews] = useState({});
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState('startDate');

  const setDates = (sd, ed) => {
    setStartDate(sd);
    setEndDate(ed);
  };

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
        <section className="section">
          <h1 className="title">
            Analytics Dashboard v1: Page Views & Reading
          </h1>
        </section>
        {!isSignedIn ? (
          <div id="signin-button"></div>
        ) : (
          <div>
            <div className="container">
              <section className="section">
                <DateRangePickerWrapper
                  startDate={startDate}
                  endDate={endDate}
                  setDates={setDates}
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                />
              </section>

              <PageViews
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
                setPageViews={setPageViews}
                pageViews={pageViews}
              />

              <ReadingDepthData
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
                pageViews={pageViews}
              />

              <ReadingFrequencyData
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx global>
        {datePickerStyles}
      </style>
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
