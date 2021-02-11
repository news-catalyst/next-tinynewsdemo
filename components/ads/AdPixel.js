export default function AdPixel({ pixel }) {
  const uniq = pixel.replace('UNIQID', 'WEBVIEW');

  return (
    <img
      src={uniq}
      width={0}
      height={0}
      aria-hidden={true}
      style={{
        display: 'none',
        height: 0,
        width: 0,
      }}
    />
  );
}
