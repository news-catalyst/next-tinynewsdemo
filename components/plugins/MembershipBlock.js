import DonationOptionsBlock from './DonationOptionsBlock';

export default function MembershipBlock({ metadata, wrap = true }) {
  const block = (
    <div className={`newsletter ${!wrap && 'block'}`}>
      <h4>{metadata.membershipHed}</h4>
      <p>{metadata.membershipDek}</p>
      <br />
      <DonationOptionsBlock metadata={metadata} />
    </div>
  );

  return wrap ? <div className="block">{block}</div> : block;
}
