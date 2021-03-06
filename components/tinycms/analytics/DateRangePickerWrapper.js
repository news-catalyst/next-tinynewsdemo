import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .DateRangePickerInput {
    border-radius: 4px;
    overflow: hidden;
    justify-content: space-around;
  }
`;

export default function DateRangePickerWrapper(props) {
  return (
    <StyledWrapper tw="flex justify-end pt-8">
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
    </StyledWrapper>
  );
}
