import React from 'react';
import tw from 'twin.macro';

const SubHeaderContainer = tw.div`pt-10 pb-5`;
const SubHeader = tw.h1`inline-block text-xl font-extrabold text-gray-900 tracking-tight`;

const YesterdaysNewsletter = (props) => {
  return (
    <>
      <SubHeaderContainer>
        <SubHeader>New subscribers: {props.subscriberCount}</SubHeader>
      </SubHeaderContainer>
    </>
  );
};

export default YesterdaysNewsletter;
