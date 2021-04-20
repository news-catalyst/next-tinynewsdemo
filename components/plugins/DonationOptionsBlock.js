import { generateMonkeypodUrl } from '../../lib/utils';

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
    <div className="column is-one-third is-centered">
      <div className="card" key={`donate-option-${i}`}>
        <header className="card-header">
          <h2 className="card-header-title is-centered">{option.name}</h2>
        </header>
        <div className="card-content">
          <div className="content">
            <h3 className="title">${option.amount}</h3>

            <p className="content">Monthly subscription amount.</p>
          </div>
        </div>
        <footer className="card-footer">
          <a
            className="card-footer-item"
            href={generateMonkeypodUrl(option.uuid)}
          >
            Donate
          </a>
        </footer>
      </div>
    </div>
  ));

  return wrap ? <div className="columns">{block}</div> : block;
}
