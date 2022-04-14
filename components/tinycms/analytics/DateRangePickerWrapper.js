import { useState } from 'react';
import Head from 'next/head';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import styled from 'styled-components';
import { sub } from 'date-fns';

const StyledWrapper = styled.div`
  .DateRangePickerInput {
    border-radius: 4px;
    overflow: hidden;
    justify-content: space-around;
  }
`;

export default function DateRangePickerWrapper(props) {
  const [internalStart, setInternalStart] = useState(
    sub(new Date(), { months: 1 })
  );
  const [internalEnd, setInternalEnd] = useState(new Date());

  function handleSelect(dates) {
    const [start, end] = dates;
    setInternalStart(start);
    setInternalEnd(end);
    props.setDates(start, end);
  }

  const MyContainer = ({ className, children }) => {
    return (
      <div style={{ padding: '16px', color: '#fff' }}>
        <CalendarContainer className={className}>
          <div style={{ background: '#f0f0f0' }}>Pick a date range</div>
          <div style={{ position: 'relative' }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/4.6.0/react-datepicker.min.css"
        />
      </Head>
      <StyledWrapper tw="py-8">
        <p>
          <strong>Pick your date range</strong>
        </p>
        <DatePicker
          selected={internalStart}
          onChange={handleSelect}
          startDate={internalStart}
          endDate={internalEnd}
          selectsRange
          calendarContainer={MyContainer}
        />

        {/* <DateRangePicker
          isOutsideRange={() => false}
          startDateId="startDate"
          endDateId="endDate"
          startDate={props.startDate}
          endDate={props.endDate}
          onDatesChange={({ startDate, endDate }) => {
            props.setDates(startDate, endDate);
          }}
          focusedInput={props.focusedInput}
          onFocusChange={(focusedInput) => {
            props.setFocusedInput(focusedInput);
          }}
        /> */}
        <p tw="text-gray-500 text-xs">
          We default to the latest month of data, but you can pick any range you
          wish.
        </p>
      </StyledWrapper>
    </>
  );
}
