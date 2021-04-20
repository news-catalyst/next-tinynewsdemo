import React, { useEffect, useRef } from 'react';
import tw from 'twin.macro';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

export default function MailchimpReport(props) {
  const campaignsRef = useRef();
  useEffect(() => {
    if (window.location.hash && window.location.hash === '#campaigns') {
      if (campaignsRef) {
        campaignsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.reports]);

  if (!props.reports) console.error('No report passed for mailchimp');
  return (
    <div ref={campaignsRef}>
      {props.reports.map((report) => (
        <>
          <SubHeaderContainer>
            <SubHeader>Newsletter Campaign: {report.campaign_title}</SubHeader>
          </SubHeaderContainer>

          <table tw="w-full table-auto">
            <thead>
              <tr>
                <th tw="px-4">Metric</th>
                <th tw="px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  List name
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.list_name}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Emails sent
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.emails_sent}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Sent time
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {new Date(report.send_time).toLocaleDateString()}{' '}
                  {new Date(report.send_time).toLocaleTimeString()}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Opens (count)
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.opens.opens_total}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Unique Opens
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.opens.unique_opens}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Open Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.opens.open_rate * 100}%
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Clicks
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.clicks.clicks_total}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Click Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.clicks.click_rate * 100}%
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Subscribe Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.list_stats.sub_rate * 100}%
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Unsubscribe Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.list_stats.unsub_rate * 100}%
                </td>
              </tr>
              {report.growth.history.map((month) => (
                <tr key={`report-growth-row-${month.month}`}>
                  <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                    Month: {month.month}
                  </td>
                  <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                    <table>
                      <tbody>
                        <tr>
                          <th>Subscribed</th>
                          <td>{month.subscribed}</td>
                        </tr>
                        <tr>
                          <th>Unsubscribed</th>
                          <td>{month.unsubscribed}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}
    </div>
  );
}
