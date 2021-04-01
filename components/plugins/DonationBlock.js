import Donate from '../nav/Donate';

export default function DonationBlock({ metadata, wrap = true }) {
  const block = (
    <div className={`newsletter ${!wrap && 'block'}`}>
      <h4>{metadata.donateBlockHed}</h4>
      <p>{metadata.donateBlockDek}</p>
      <br />
      <Donate label={metadata.supportCTA} url={metadata.supportURL} />
    </div>
  );

  return wrap ? <div className="block">{block}</div> : block;
}
