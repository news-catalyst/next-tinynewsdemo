import React from 'react';

export default function MailchimpReport(props) {
  console.log('campaigns:', props.campaigns);

  return (
    <div>
      {props.campaigns.map((campaign) => (
        <section className="section">
          <h2 className="subtitle">
            Newsletter Campaign: {campaign.settings.subject_line}
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
                <td>Campaign title</td>
                <td>{campaign.settings.title}</td>
              </tr>
              <tr>
                <td>List name</td>
                <td>{campaign.recipients.list_name}</td>
              </tr>
              <tr>
                <td>Campaign status</td>
                <td>{campaign.status}</td>
              </tr>
              <tr>
                <td>Sent time</td>
                <td>
                  {new Date(campaign.send_time).toLocaleDateString()}{' '}
                  {new Date(campaign.send_time).toLocaleTimeString()}
                </td>
              </tr>
              <tr>
                <td>Emails sent</td>
                <td>{campaign.emails_sent}</td>
              </tr>
              <tr>
                <td>Opens</td>
                <td>{campaign.report_summary.opens}</td>
              </tr>
              <tr>
                <td>Unique Opens</td>
                <td>{campaign.report_summary.unique_opens}</td>
              </tr>
              <tr>
                <td>Open Rate</td>
                <td>{campaign.report_summary.open_rate * 100}%</td>
              </tr>
              <tr>
                <td>Clicks</td>
                <td>{campaign.report_summary.clicks}</td>
              </tr>
              <tr>
                <td>Click Rate</td>
                <td>{campaign.report_summary.click_rate * 100}%</td>
              </tr>
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
