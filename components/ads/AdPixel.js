export default function AdPixel({ pixel, isAmp }) {
  const uniq = pixel.replace('UNIQID', 'WEBVIEW');

  return (
    <>
      {isAmp ? (
        <amp-img width={0} height={0} src={uniq} layout="nodisplay" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
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
          alt=""
        />
      )}
    </>
  );
}
