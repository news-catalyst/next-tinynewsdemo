import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import moment from 'moment';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';
import AverageSessionDuration from '../../../components/tinycms/analytics/AverageSessionDuration';
import DailySessions from '../../../components/tinycms/analytics/DailySessions';
import GeoSessions from '../../../components/tinycms/analytics/GeoSessions';
import ReferralSource from '../../../components/tinycms/analytics/ReferralSource';

export default function SessionsOverview(props) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState(null);

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
        {!isSignedIn ? (
          <div id="signin-button"></div>
        ) : (
          <div>
            <div className="container">
              <section className="section">
                <h1 className="title">Sessions Overview</h1>
                <DateRangePickerWrapper
                  startDate={startDate}
                  endDate={endDate}
                  setDates={setDates}
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                />
              </section>

              <DailySessions
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
              />

              <GeoSessions
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
              />

              <AverageSessionDuration
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
              />

              <ReferralSource
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
