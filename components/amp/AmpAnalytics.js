export default function AmpAnalytics(props) {
  return (
    <amp-analytics type={props.type}>
      {props.script && (
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(props.script),
          }}
        />
      )}
    </amp-analytics>
  );
}
