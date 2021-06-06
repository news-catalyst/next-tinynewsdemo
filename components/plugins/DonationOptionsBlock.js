import tw from 'twin.macro';
import { generateMonkeypodUrl } from '../../lib/utils';

const OptionsBlockContainer = tw.div`md:grid md:grid-cols-3 md:gap-4`;
const Card = tw.div`rounded overflow-hidden shadow-lg w-full border-gray-200 border my-8 md:my-0`;
const CardHeader = tw.header`border-b border-gray-200 pb-4 mb-4`;
const CardHeading = tw.h4`text-2xl leading-none font-bold text-center px-8 pt-4`;
const CardContent = tw.div`p-8`;
const CardDonationAmount = tw.h5`text-4xl font-bold text-center leading-none mb-4`;
const CardDonationDescription = tw.p`text-lg`;
const CardFooter = tw.footer`border-t border-gray-200 mt-4`;
const DonateFooterLink = tw.a`items-center justify-center flex text-blue-500 font-bold w-full hover:bg-blue-500 hover:text-white py-4`;

export default function DonationOptionsBlock({ metadata, wrap = true }) {
  if (metadata.donationOptions === '' || metadata.donationOptions === null) {
    return null;
  }

  let parsedOptions = [];
  try {
    parsedOptions = JSON.parse(metadata.donationOptions);
  } catch (e) {
    console.error(e);
  }

  const block = parsedOptions.map((option, i) => (
    <Card key={`donate-option-${i}`}>
      <CardHeader>
        <CardHeading>{option.name}</CardHeading>
      </CardHeader>
      <CardContent>
        <div className="content">
          <CardDonationAmount>${option.amount}</CardDonationAmount>
          <CardDonationDescription>
            Monthly subscription amount.
          </CardDonationDescription>
        </div>
      </CardContent>
      <CardFooter>
        <DonateFooterLink
          href={`${process.env.NEXT_PUBLIC_MONKEYPOD_URL}&option_id=${process.env.NEXT_PUBLIC_MONKEYPOD_UUID}&amount=${option.amount}`}
        >
          Donate
        </DonateFooterLink>
      </CardFooter>
    </Card>
  ));

  return wrap ? <OptionsBlockContainer>{block}</OptionsBlockContainer> : block;
}
