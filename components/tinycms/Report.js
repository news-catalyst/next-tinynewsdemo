import React, { useState, useEffect } from 'react';

const Report = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const queryReport = () => {
      //(1)
      window.gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [
              {
                viewId: process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID,
                dateRanges: [
                  {
                    startDate: '30daysAgo',
                    endDate: 'today',
                  },
                ],
                metrics: [
                  {
                    expression: 'ga:sessions',
                  },
                ],
                dimensions: [
                  {
                    name: 'ga:date',
                  },
                ],
              },
            ],
          },
        })
        .then(displayResults, console.error.bind(console));
    };

    const displayResults = (response) => {
      //(2)
      const queryResult = response.result.reports[0].data.rows;
      const result = queryResult.map((row) => {
        const dateSting = row.dimensions[0];
        const formattedDate = `${dateSting.substring(0, 4)}
        -${dateSting.substring(4, 6)}-${dateSting.substring(6, 8)}`;
        return {
          date: formattedDate,
          sessions: row.metrics[0].values[0],
        };
      });
      setData(result);
    };

    queryReport();
  }, []);

  var rows = data.map((row) => (
    <div key={row.date}>{`${row.date}: ${row.sessions} sessions`}</div> //(3)
  ));
  return (
    <>
      <h1 className="title">Sessions</h1>
      {rows}
    </>
  );
};

export default Report;
