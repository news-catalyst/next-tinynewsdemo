import React, { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';

import ControlledInput from './ControlledInput';
import { TinyInputField } from './TinyFormElements';

const Input = styled.input`
  ${tw`px-3 py-3 mb-4 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;

export default function DonationOption(props) {
  const [index, setIndex] = useState(props.index);

  const [name, setName] = useState(props.name);
  const [cta, setCTA] = useState(props.cta);
  const [desc, setDesc] = useState(props.desc);
  const [paymentType, setPaymentType] = useState(props.paymentType);
  const [monkeypodId, setMonkeypodId] = useState(props.monkeypodId);
  const [amount, setAmount] = useState(props.amount);

  const updateName = (index, value) => {
    setName(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].name = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  const updateCTA = (index, value) => {
    setCTA(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].cta = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  const updateDesc = (index, value) => {
    setDesc(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].description = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  const updatePaymentType = (index, value) => {
    setPaymentType(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].paymentType = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  const updateAmount = (index, value) => {
    setAmount(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].amount = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  const updateMonkeypodId = (index, value) => {
    setMonkeypodId(value);

    let donationOptions = JSON.parse(props.parsedData.donationOptions);
    donationOptions[index].monkeypodId = value;

    props.updateParsedData((prevState) => ({
      ...prevState,
      ['donationOptions']: JSON.stringify(donationOptions),
    }));
  };

  return (
    <div key={`option-${index}`}>
      <div tw="mt-2">
        <TinyInputField
          tw="w-full rounded-md border-solid border-gray-300"
          name={`donationOptions-${index}-name`}
          value={name}
          onChange={(ev) => updateName(index, ev.target.value)}
          label="Option name"
        />
      </div>
      <div tw="mt-2">
        <label htmlFor={`donationOptions-${index}-amount`}>
          <span tw="mt-1 font-bold">Option amount</span>
          <Input
            tw="w-full rounded-md border-solid border-gray-300"
            type="number"
            name={`donationOptions-${index}-amount`}
            value={amount}
            onChange={(ev) => updateAmount(index, ev.target.value)}
          />
        </label>
      </div>
      <div tw="mt-2 mb-8">
        <label tw="block">
          <input
            type="radio"
            name={`donationOptions-${index}-paymentType`}
            value="monthly"
            checked={paymentType === 'monthly'}
            onChange={(ev) => updatePaymentType(index, ev.target.value)}
          />
          <span tw="p-2 mt-1 font-bold">Monthly</span>
        </label>
        <label tw="block">
          <input
            type="radio"
            name={`donationOptions-${index}-paymentType`}
            value="one-time"
            checked={paymentType === 'one-time'}
            onChange={(ev) => updatePaymentType(index, ev.target.value)}
          />
          <span tw="p-2 mt-1 font-bold">One-time payment</span>
        </label>
        <label tw="block">
          <input
            type="radio"
            name={`donationOptions-${index}-paymentType`}
            value="pay-what-you-want"
            checked={paymentType === 'pay-what-you-want'}
            onChange={(ev) => updatePaymentType(index, ev.target.value)}
          />
          <span tw="p-2 mt-1 font-bold">Pay what you want</span>
        </label>
      </div>
      <div tw="mt-2">
        <TinyInputField
          tw="w-full rounded-md border-solid border-gray-300"
          name={`donationOptions-${index}-description`}
          value={desc}
          onChange={(ev) => updateDesc(index, ev.target.value)}
          label="Option description"
        />
      </div>
      <div tw="mt-2">
        <TinyInputField
          tw="w-full rounded-md border-solid border-gray-300"
          name={`donationOptions-${index}-cta`}
          value={cta}
          onChange={(ev) => updateCTA(index, ev.target.value)}
          label="Option CTA"
        />
      </div>
      <div tw="mt-2">
        <label htmlFor={`donationOptions-${index}-monkeypodId`}>
          <span tw="mt-1 font-bold">Option MonkeyPod ID</span>
          <ControlledInput
            tw="w-full rounded-md border-solid border-gray-300"
            type="text"
            name={`donationOptions-${index}-monkeypodId`}
            value={monkeypodId}
            onChange={(ev) => updateMonkeypodId(index, ev.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
