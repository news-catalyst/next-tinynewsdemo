import React, { useEffect, useState } from 'react';
import { addDays } from 'date-fns';
import mailchimp from '@mailchimp/mailchimp_marketing';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import NewsletterSignupFormData from '../../../components/tinycms/analytics/NewsletterSignupFormData';
import MailchimpReport from '../../../components/tinycms/analytics/MailchimpReport';
import moment from 'moment';
import DateRangePickerWrapper from '../../../components/tinycms/analytics/DateRangePickerWrapper';
import datePickerStyles from '../../../styles/datepicker.js';

export default function NewsletterOverview(props) {
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
            Analytics Dashboard v1: Newsletters Overview
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

              <NewsletterSignupFormData
                viewID={viewID}
                startDate={startDate}
                endDate={endDate}
              />

              <MailchimpReport
                mailchimpKey={props.mailchimpKey}
                mailchimpServer={props.mailchimpServer}
                reports={props.reports}
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

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  });

  let fullReports = [];
  let reportsResponse = await mailchimp.reports.getAllCampaignReports({
    since_send_time: addDays(new Date(), -30),
  });
  let report = reportsResponse.reports[0];
  let listId = report.list_id;
  let data = await mailchimp.lists.getListGrowthHistory(listId);
  report['growth'] = data;
  fullReports.push(report);

  return {
    props: {
      clientID: clientID,
      clientSecret: clientSecret,
      mailchimpKey: process.env.MAILCHIMP_API_KEY,
      mailchimpServer: process.env.MAILCHIMP_SERVER_PREFIX,
      reports: fullReports,
    },
  };
}
