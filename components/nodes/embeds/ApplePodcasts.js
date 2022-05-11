export default function ApplePodcasts({ node, amp }) {
  const embedUrl = node.link.split('//')[1];
  console.log(embedUrl);

  const el = amp ? (
    <div />
  ) : (
    <iframe
      allow="autoplay *; encrypted-media *; fullscreen *"
      frameBorder="0"
      height="450"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      src={`https://embed.${embedUrl}`}
    />
  );

  return el;
}
