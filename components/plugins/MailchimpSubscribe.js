import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { useInView } from 'react-intersection-observer';
import { determineTextColor } from '../../lib/utils';
import Colors from '../common/Colors';

const Group = tw.div`relative`;
const Input = tw.input`block w-full border-b border-gray-500 opacity-70 text-black font-bold`;
const Submit = styled.input(({ textColor, backgroundColor }) => ({
  ...tw`block absolute cursor-pointer rounded-full font-bold leading-none w-8 h-8 pl-2 right-2 z-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

const url = '/api/subscribe/';

const Newsletter = ({ articleTitle, metadata }) => {
  const { trackEvent } = useAnalytics();
  const [ref, inView] = useInView({ triggerOnce: true });

  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (inView) {
      trackEvent({
        action: 'newsletter modal impression 1',
        category: 'NTG newsletter',
        label: articleTitle,
        non_interaction: true,
      });
    }

    let bgc;
    let tc;

    if (metadata.color === 'custom') {
      bgc = determineTextColor(metadata.primaryColor);
      tc = metadata.primaryColor;
    } else if (Colors[metadata.color]) {
      tc = Colors[metadata.color].PromoBlockCTAText;
      bgc = Colors[metadata.color].PromoBlockCTABackground;
    }

    setBackgroundColor(bgc);
    setTextColor(tc);
  }, [inView, articleTitle, trackEvent, metadata]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setStatus('sending');
    // (email &&
    // email.value.indexOf('@') > -1 &&)
    try {
      const subscribeURL = url + email;
      fetch(subscribeURL, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setStatus('success');
          setMessage('Thank you for signing up for our newsletter.');
          trackEvent({
            action: 'newsletter signup',
            category: 'NTG newsletter',
            label: 'success',
            non_interaction: false,
          });
          return data;
        })
        .catch((error) => console.error(error));
    } catch (error) {
      return console.error(error);
    }
  };

  return (
    <div ref={ref}>
      <form onSubmit={handleSubmit}>
        <div>
          {status === 'sending' && (
            <div style={{ color: 'blue' }}>sending...</div>
          )}
          {status === 'error' && (
            <div
              style={{ color: '#db2955; font-weight: bold' }}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          {status === 'success' && (
            <div
              style={{ color: '#7cae7a; font-weight: bold' }}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          <Group>
            <Input
              type="email"
              placeholder="Your email"
              className="input"
              onChange={(ev) => setEmail(ev.target.value)}
              value={email}
              style={{
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            />
            <span className="bar"></span>
            <Submit
              type="submit"
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
      </form>
    </div>
  );
};

export default Newsletter;
