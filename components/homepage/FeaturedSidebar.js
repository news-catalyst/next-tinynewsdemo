export default function FeaturedSidebar({ metadata }) {
  return (
    <>
      <div className="block">
        <h2>{metadata.aboutHed}</h2>
        <p>{metadata.aboutDek}</p>
        <a className="block__cta" href="/about">
          {metadata.aboutCTA}
        </a>
      </div>
      <div className="block">
        <h2>{metadata.supportHed}</h2>
        <p>{metadata.supportDek}</p>
        <a className="block__cta" href="/donate">
          {metadata.supportCTA}
        </a>
      </div>
    </>
  );
}
