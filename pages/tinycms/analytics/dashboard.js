import { useAnalyticsApi } from 'react-use-analytics-api';
import React, { useState, useEffect } from 'react';
import {
  AuthorizeButton,
  SessionsByDateChart,
  PageViewsPerPathChart,
  SignOutButton,
  GeoChart,
} from 'react-analytics-charts';

export default function CustomDashboardExample(props) {
  const [viewId, setViewId] = useState(
    'ga:' + process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const { ready, gapi, authorized } = useAnalyticsApi();

  return (
    <div>
      <h1 className="subtitle">Analytics Dashboard</h1>
      {!ready && 'Please wait...'}
      {ready && (
        <div>
          {!authorized && (
            <AuthorizeButton
              gapi={gapi}
              authOptions={{ clientId: props.clientID }}
            />
          )}
          {authorized && (
            <div>
              <div>
                <SessionsByDateChart gapi={gapi} viewId={viewId} />
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
                <PageViewsPerPathChart
                  gapi={gapi}
                  viewId={viewId}
                  days={30}
                  style={{ margin: '15px' }}
                />
              </div>
              <div>
                <SignOutButton gapi={gapi} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const clientID = process.env.ANALYTICS_CLIENT_ID;
  const clientSecret = process.env.ANALYTICS_CLIENT_SECRET;
  const viewID = process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID;

  return {
    props: {
      clientID: clientID,
      clientSecret: clientSecret,
      viewID: viewID,
    },
  };
}
