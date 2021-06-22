import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { useInView } from 'react-intersection-observer';
import { determineTextColor } from '../../lib/utils';
import Colors from '../common/Colors';

const Group = tw.div`relative`;
const Input = tw.input`block w-full border-b border-gray-500 opacity-70 text-black font-bold`;
const Bar = tw.div``;
const Submit = styled.input(({ textColor, backgroundColor }) => ({
  ...tw`block absolute cursor-pointer rounded-full font-bold leading-none w-8 h-8 pl-2 right-2 z-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

// you can get this url from the embed code form action
const url = process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL;

const CustomForm = ({ status, message, onValidated, metadata }) => {
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  useEffect(() => {
    let bgc;
    let tc;

    if (metadata.color === 'custom') {
      bgc = determineTextColor(metadata.primaryColor);
      tc = metadata.primaryColor;
    } else if (Colors[metadata.color]) {
      tc = Colors[metadata.color].PromoBlockCTAText;
      bgc = Colors[metadata.color].PromoBlockCTABackground;
      console.log('unknown color', metadata.color);
    }

    setBackgroundColor(bgc);
    setTextColor(tc);
  }, [metadata]);

  let email, name;
  const submit = () =>
    email &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <div>
      {status === 'sending' && <div style={{ color: 'blue' }}>sending...</div>}
      {status === 'error' && (
        <div
          style={{ color: '#db2955; font-weight: bold;' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === 'success' && (
        <div
          style={{ color: '#7cae7a; font-weight: bold;' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <Group>
        <Input
          ref={(node) => (email = node)}
          type="email"
          placeholder="Your email"
          className="input"
          style={{
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
          }}
        />
        <span className="bar"></span>
        <Submit
          type="submit"
          onClick={submit}
          value="→"
          style={{
            bottom: '0.3125rem',
            paddingTop: '0.375rem',
            fontSize: '20px',
            padding: '5px 5px 10px 5px',
          }}
          textColor={textColor}
          backgroundColor={backgroundColor}
        />
      </Group>
    </div>
  );
};

const Newsletter = ({ articleTitle, metadata }) => {
  const { trackEvent } = useAnalytics();
  const [ref, inView] = useInView({ triggerOnce: true });
  useEffect(() => {
    if (inView) {
      trackEvent({
        action: 'newsletter modal impression 1',
        category: 'NTG newsletter',
        label: articleTitle,
        non_interaction: true,
      });
    }
  }, [inView, articleTitle, trackEvent]);

  return (
    <div ref={ref}>
      <MailchimpSubscribe
        url={url}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => {
              subscribe(formData);
              trackEvent({
                action: 'newsletter signup',
                category: 'NTG newsletter',
                label: 'success',
                non_interaction: false,
              });
            }}
            metadata={metadata}
          />
        )}
      />
    </div>
  );
};

export default Newsletter;
