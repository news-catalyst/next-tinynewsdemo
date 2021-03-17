import React, { useState, useEffect } from 'react';
import { AnalyticsDashboard } from 'react-analytics-charts';
import {
  PageViewsPerPathChart,
  SessionsByDateChart,
  GeoChart,
  SessionsBySourceChart,
  SessionsByHourChart,
} from 'react-analytics-charts';

export default function Dashboard(props) {
  const [viewID, setViewID] = useState(
    'ga:' + process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [clientID, setClientID] = useState(props.clientID);
  console.log('clientID: ', clientID);

  return (
    <AnalyticsDashboard
      authOptions={{
        clientId: clientID,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      }}
      dashId="usa"
      renderCharts={(gapi, viewId) => {
        const chartStyles = {
          margin: '15px',
          maxWidth: 400,
        };

        return (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <SessionsByDateChart
                gapi={gapi}
                viewId={viewId}
                style={chartStyles}
                showPageViews
                showUsers
              />
              <GeoChart
                gapi={gapi}
                query={{
                  metrics: 'ga:sessions,ga:pageviews',
                  dimensions: 'ga:region',
                  'start-date': `28daysAgo`,
                  'end-date': 'today',
                  ids: viewId,
                }}
                container="usa-traffic-geo-chart"
                options={{
                  region: 'US',
                  resolution: 'provinces',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <PageViewsPerPathChart
                gapi={gapi}
                viewId={viewId}
                days={30}
                style={{ margin: '15px' }}
              />
            </div>
          </>
        );
      }}
    />
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
