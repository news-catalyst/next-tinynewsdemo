import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { useInView } from 'react-intersection-observer';
import { determineTextColor } from '../../lib/utils';
import Colors from '../common/Colors';

const Group = tw.div`relative`;
const Input = tw.input`block w-full border-b border-gray-500 opacity-70 text-black font-bold`;
const Submit = styled.input(({ textColor, backgroundColor, tinycms }) => ({
  ...tw`block absolute cursor-pointer rounded-full font-bold leading-none w-8 h-8 pl-2 right-2 z-10`,
  backgroundColor: backgroundColor,
  color: textColor,
  pointerEvents: tinycms ? 'none' : '',
}));

const url = '/api/subscribe';

const NewsletterSubscribe = ({ articleTitle, metadata, tinycms }) => {
  const { trackEvent } = useAnalytics();
  const [ref, inView] = useInView({ triggerOnce: true });

  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const [
    trackedNewsletterImpression,
    setTrackedNewsletterImpression,
  ] = useState(false);
  const [redirectURL, setRedirectURL] = useState(metadata.newsletterRedirect);

  useEffect(() => {
    if (inView && !trackedNewsletterImpression) {
      trackEvent({
        action: 'newsletter modal impression 1',
        category: 'NTG newsletter',
        label: articleTitle,
        non_interaction: true,
      });
      setTrackedNewsletterImpression(true);
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

    try {
      const subscribeURL = url;
      const response = await fetch(subscribeURL, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          name: name,
        }),
      });
      const statusCode = response.status;
      const data = await response.json();

      if (statusCode < 200 || statusCode > 299) {
        setStatus('error');
        setMessage(data.message);
      } else {
        setStatus('success');
        setMessage('Thank you for signing up for our newsletter.');
        trackEvent({
          action: 'newsletter signup',
          category: 'NTG newsletter',
          label: 'success',
          non_interaction: false,
        });
        if (redirectURL) {
          window.location.href = redirectURL;
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage(error);
    }
  };

  return (
    <div ref={ref}>
      <form
        onSubmit={handleSubmit}
        target="_top"
        method="post"
        action-xhr={url}
      >
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

          {status !== 'success' && (
            <Group>
              <Input
                type="text"
                placeholder="Your name"
                className="input"
                onChange={(ev) => setName(ev.target.value)}
                value={name}
                style={{
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  marginBottom: '.25rem',
                }}
              />

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
                tinycms={tinycms}
              />
            </Group>
          )}
        </div>
      </form>
    </div>
  );
};

NewsletterSubscribe.displayName = 'NewsletterSubscribe';

export default NewsletterSubscribe;
