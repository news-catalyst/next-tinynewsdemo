import React from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import tw from 'twin.macro';

export default function AdminHeader(props) {
  return (
    <div tw="block pt-8 mx-auto grid flex justify-center grid-cols-2 gap-4">
      <div tw="mr-8">
        <span tw="text-xl font-bold">
          {props.title} ({props.currentLocale})
        </span>
      </div>
      <div tw="ml-8">
        <LocaleSwitcher
          locales={props.locales}
          currentLocale={props.currentLocale}
          id={props.id}
        />
      </div>
    </div>
  );
}
