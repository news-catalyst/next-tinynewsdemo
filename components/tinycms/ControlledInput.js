import React, { useEffect, useRef, useState } from 'react';
import tw, { styled } from 'twin.macro';

const StyledInput = styled.input`
  ${tw`px-3 py-3 mb-4 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;
const ControlledInput = (props) => {
  const { value, onChange, ...rest } = props;
  const [cursor, setCursor] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const input = ref.current;
    if (input) input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleChange = (e) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  return (
    <StyledInput ref={ref} value={value} onChange={handleChange} {...rest} />
  );
};

export default ControlledInput;
