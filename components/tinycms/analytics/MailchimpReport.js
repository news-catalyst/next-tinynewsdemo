import React, { useEffect, useState, useRef } from 'react';
import tw from 'twin.macro';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const SubHeaderContainer = tw.div`pt-3 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

export default function MailchimpReport(props) {
  const campaignsRef = useRef();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let chartValues = [];
    // https://mailchimp.com/developer/marketing/api/list-growth-history/get-growth-history-by-month/
    // the mailchimp API returns growth history month by month with
    // `subscribed` equal to the "Total subscribed members on the list at the end of the month. "
    // `unsubscribed` is also available but doesn't seem necessary to subtract from the monthly subscriber figures here

    props.reports[0].growth.history.map((monthlyStats) => {
      let lineDataPoint = {
        month: monthlyStats.month,
        subscribers: parseInt(monthlyStats.subscribed),
      };
      chartValues.push(lineDataPoint);
    });
    setChartData(chartValues);

    if (window.location.hash && window.location.hash === '#campaigns') {
      if (campaignsRef) {
        campaignsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [props.reports]);

  if (!props.reports) console.error('No report passed for mailchimp');
  return (
    <div ref={campaignsRef}>
      {props.reports.map((report, i) => (
        <div key={`report-${i}`}>
          <SubHeaderContainer>
            <SubHeader>Newsletter Audience Stats</SubHeader>
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
                  Newsletter emails sent
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.campaign_count}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Member Count
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.member_count}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Unsubscribe Count
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.unsubscribe_count}
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
                  Signups since last send
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.member_count_since_send}
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Unsubscribes since last send
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.unsubscribe_count_since_send}
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
                  Open rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {report.stats.open_rate.toFixed(2)}%
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
                  {report.stats.click_rate.toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Subscribe Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {Math.round(report.list_stats.sub_rate * 100).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  Unsubscribe Rate
                </td>
                <td tw="border border-gray-500 px-4 py-2 text-gray-600 font-medium">
                  {Math.round(report.list_stats.unsub_rate * 100).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <SubHeaderContainer>
        <SubHeader>Monthly Subscriber Count</SubHeader>
      </SubHeaderContainer>

      <LineChart width={740} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" reversed={true} />
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="subscribers"
          stroke="#8884d8"
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}
