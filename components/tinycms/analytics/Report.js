import React, { useState } from 'react';
import { addDays } from 'date-fns';
import CustomDimensions from './CustomDimensions';

const Report = (props) => {
  const [viewID, setViewID] = useState(
    process.env.NEXT_PUBLIC_ANALYTICS_VIEW_ID
  );
  const [startDate, setStartDate] = useState(addDays(new Date(), -30));
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="container">
      <section className="section">
        <p className="content">
          Data from {startDate.toLocaleDateString()} to{' '}
          {endDate.toLocaleDateString()}.
        </p>
      </section>

      <section className="section"></section>
      <CustomDimensions
        viewID={viewID}
        startDate={startDate}
        endDate={endDate}
        metrics={['ga:sessions']}
        dimensions={['ga:dimension4']}
        label="Donor"
      />
    </div>
  );
};

export default Report;
