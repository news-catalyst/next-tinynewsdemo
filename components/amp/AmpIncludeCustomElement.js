import Head from 'next/head'

export default function AmpIncludeCustomElement(props) {
  console.log(`Inject ${props.name} into head!`);

  return (
    <Head>
    </Head>
  )
}
