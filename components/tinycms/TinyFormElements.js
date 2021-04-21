import tw, { css, styled } from 'twin.macro';
import { useRouter } from 'next/router';

export const FormContainer = tw.div`container mx-auto min-w-0 flex-auto px-4 sm:px-6 xl:px-8 pt-10 pb-24 lg:pb-16`;
const ButtonsContainer = tw.div`grid grid-cols-4 gap-24 mt-4`;
const FormTitleContainer = tw.div`pt-5 pb-10`;
const FormTitle = tw.h1`inline-block text-3xl font-extrabold text-gray-900 tracking-tight`;
const Input = styled.input`
  ${tw`mb-5 px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const TextArea = styled.textarea`
  ${tw`px-3 py-3 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const SubmitButton = tw.input`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-green-700 hover:bg-green-500 text-white md:rounded`;
const CancelButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-gray-600 hover:bg-gray-300 text-white md:rounded`;

export const FormHeader = ({ title, ...props }) => {
  return (
    <FormTitleContainer>
      <FormTitle>{title}</FormTitle>
    </FormTitleContainer>
  );
};

export const TinySubmitCancelButtons = ({ destURL, ...props }) => {
  const router = useRouter();
  async function handleCancel(ev, url) {
    ev.preventDefault();
    router.push(url);
  }

  return (
    <ButtonsContainer>
      <SubmitButton type="submit" value="Submit" />
      <CancelButton onClick={(ev) => handleCancel(ev, destURL)}>
        Cancel
      </CancelButton>
    </ButtonsContainer>
  );
};

export const TinyInputField = ({ name, onChange, value, label, ...props }) => {
  return (
    <label htmlFor={name}>
      <span tw="block font-medium text-gray-700">{label}</span>
      <Input type="text" value={value} name={name} onChange={onChange} />
    </label>
  );
};

export const TinyCheckboxField = ({
  label,
  name,
  checked,
  onChange,
  ...props
}) => {
  return (
    <label tw="mt-5" htmlFor={name}>
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span tw="ml-5 font-medium text-gray-700">{label}</span>
    </label>
  );
};

export const TinyYesNoField = ({
  name,
  value,
  onChange,
  labelYes,
  labelNo,
  ...props
}) => {
  return (
    <div tw="grid grid-cols-2 mt-4">
      <label>
        <input
          type="radio"
          name={name}
          value="yes"
          checked={value === 'yes'}
          onChange={onChange}
        />{' '}
        <span tw="font-medium text-gray-700">{labelYes}</span>
      </label>
      <label>
        <input
          type="radio"
          name={name}
          value="no"
          checked={value === 'no'}
          onChange={onChange}
        />{' '}
        <span tw="font-medium text-gray-700">{labelNo}</span>
      </label>
    </div>
  );
};

export const TinyTextArea = ({ name, label, value, onChange, ...props }) => {
  return (
    <label htmlFor="bio">
      <span tw="block font-medium text-gray-700">{label}</span>
      <TextArea
        tw="mt-1 block w-full"
        rows="3"
        value={value}
        name={name}
        onChange={onChange}
      />
    </label>
  );
};
