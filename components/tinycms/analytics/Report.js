import React, { useState, useEffect } from 'react';
import { addDays } from 'date-fns';
import { getMetricsData } from '../../../lib/analytics';
import AverageSessionDuration from './AverageSessionDuration';
import DailySessions from './DailySessions';
import GeoSessions from './GeoSessions';
import NewsletterSignupFormData from './NewsletterSignupFormData';
import ReadingDepthData from './ReadingDepthData';
import ReadingFrequencyData from './ReadingFrequencyData';
import ReferralSource from './ReferralSource';
import PageViews from './PageViews';
import CustomDimensions from './CustomDimensions';

const Report = (props) => {
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    // const customDimensionSubscriber = ['ga:dimension5'];
    // getMetricsData(
    //   viewID,
    //   startDate,
    //   endDate,
    //   [pageViewsMetric],
    //   customDimensionSubscriber
    // )
    //   .then((resp) =>
    //     displayCustomResults(resp, subscriberData, setSubscriberData)
    //   )
    //   .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <section className="section">
        <p className="content">
          Data from {startDate.toLocaleDateString()} to{' '}
          {endDate.toLocaleDateString()}.
        </p>
      </section>

      <DailySessions viewID={viewID} startDate={startDate} endDate={endDate} />

      <GeoSessions viewID={viewID} startDate={startDate} endDate={endDate} />
      <AverageSessionDuration
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

      <ReferralSource viewID={viewID} startDate={startDate} endDate={endDate} />

      <PageViews viewID={viewID} startDate={startDate} endDate={endDate} />

      <ReadingDepthData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

      <section className="section"></section>
      <ReadingFrequencyData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />

      <CustomDimensions
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
        metrics={['ga:sessions']}
        dimensions={['ga:dimension4']}
        label="Donor"
      />

      {/* <section className="section">
        <h2 className="subtitle">Sessions by audience segment: subscriber</h2>

        <table className="table is-fullwidth" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {subscriberData.labels.map((label, i) => (
              <tr>
                <td>{label}</td>
                <td>{subscriberData.values[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section> */}

      <p className="title is-2">Newsletter Data</p>

      <NewsletterSignupFormData
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default Report;
