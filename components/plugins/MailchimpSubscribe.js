import { useEffect } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import { useInView } from 'react-intersection-observer';

// you can get this url from the embed code form action
const url = process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL;

const CustomForm = ({ status, message, onValidated }) => {
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
      <div className="group">
        <input
          ref={(node) => (email = node)}
          type="email"
          placeholder="Your email"
          className="input"
        />
        <span className="bar"></span>
        <input type="submit" onClick={submit} className="submit" value="→" />
      </div>
    </div>
  );
};

const Newsletter = ({ articleTitle }) => {
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
  }, [inView]);

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
          />
        )}
      />
    </div>
  );
};

export default Newsletter;
