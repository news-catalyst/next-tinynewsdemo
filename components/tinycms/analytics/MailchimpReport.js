import React from 'react';

export default function MailchimpReport(props) {
  return (
    <div>
      {props.reports.map((report) => (
        <section className="section">
          <h2 className="subtitle">
            Newsletter Campaign: {report.campaign_title}
          </h2>

          <table className="table is-fullwidth" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>List name</td>
                <td>{report.list_name}</td>
              </tr>
              <tr>
                <td>Emails sent</td>
                <td>{report.emails_sent}</td>
              </tr>
              <tr>
                <td>Sent time</td>
                <td>
                  {new Date(report.send_time).toLocaleDateString()}{' '}
                  {new Date(report.send_time).toLocaleTimeString()}
                </td>
              </tr>
              <tr>
                <td>Opens (count)</td>
                <td>{report.opens.opens_total}</td>
              </tr>
              <tr>
                <td>Unique Opens</td>
                <td>{report.opens.unique_opens}</td>
              </tr>
              <tr>
                <td>Open Rate</td>
                <td>{report.opens.open_rate * 100}%</td>
              </tr>
              <tr>
                <td>Clicks</td>
                <td>{report.clicks.clicks_total}</td>
              </tr>
              <tr>
                <td>Click Rate</td>
                <td>{report.clicks.click_rate * 100}%</td>
              </tr>
              <tr>
                <td>Subscribe Rate</td>
                <td>{report.list_stats.sub_rate * 100}%</td>
              </tr>
              <tr>
                <td>Unsubscribe Rate</td>
                <td>{report.list_stats.unsub_rate * 100}%</td>
              </tr>
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
