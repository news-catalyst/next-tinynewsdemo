import MailchimpSubscribe from "react-mailchimp-subscribe"

// you can get this url from the embed code form action
const url = process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL;

const Newsletter = () => <MailchimpSubscribe url={url} />

export default Newsletter;
