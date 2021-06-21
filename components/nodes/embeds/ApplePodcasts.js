export default function ApplePodcasts({ node, amp }) {
  const el = amp ? (
    <div />
  ) : (
    <iframe
      allow="autoplay *; encrypted-media *; fullscreen *"
      frameBorder="0"
      height="175"
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      src={node.link}
    />
  );
  return el;
}
