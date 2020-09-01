import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';

// you can get this url from the embed code form action
const url = process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL;

const CustomForm = ({ status, message, onValidated }) => {
  let email, name;
  const submit = () =>
    email &&
    name &&
    email.value.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email.value,
      NAME: name.value,
    });

  return (
    <div
      style={{
        background: '#efefef',
        borderRadius: 2,
        padding: 10,
        display: 'inline-block',
      }}
    >
      {status === 'sending' && <div style={{ color: 'blue' }}>sending...</div>}
      {status === 'error' && (
        <div
          style={{ color: 'red' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === 'success' && (
        <div
          style={{ color: 'green' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <input
        ref={(node) => (name = node)}
        type="text"
        placeholder="Your name"
      />
      <br />
      <input
        ref={(node) => (email = node)}
        type="email"
        placeholder="Your email"
      />
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
};

const Newsletter = () => {
  const { trackEvent } = useAnalytics();

  return (
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
  );
};

export default Newsletter;
