import MailchimpSubscribe from "react-mailchimp-subscribe"

// you can get this url from the embed code form action
const url = "https://tinynewsco.us10.list-manage.com/subscribe/post?u=affe71ae108c8047b9e1e68c8&amp;id=fb3e2377f7"

const Newsletter = () => <MailchimpSubscribe url={url} />

export default Newsletter;
