import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import styled from 'styled-components';
import tw from 'twin.macro';

const StyledWrapper = styled.div`
  .DateRangePickerInput {
    border-radius: 4px;
    overflow: hidden;
    justify-content: space-around;
  }
`;

export default function DateRangePickerWrapper(props) {
  return (
    <StyledWrapper tw="py-8">
      <p>
        <strong>Pick your date range</strong>
      </p>
      <DateRangePicker
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
      />
      <p tw="text-gray-500 text-xs">
        We default to the latest month of data, but you can pick any range you
        wish.
      </p>
    </StyledWrapper>
  );
}
