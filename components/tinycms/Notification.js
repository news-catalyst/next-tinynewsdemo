export default function Notification(props) {
  let messages = props.message;
  if (typeof props.message === 'string') {
    messages = [props.message];
  }
  return (
    <div className={`notification is-${props.notificationType}`}>
      <button
        className="delete"
        onClick={() => props.setShowNotification(false)}
      ></button>
      {messages.map((msg) => (
        <div key={msg}>
          {msg}
          <br />
        </div>
      ))}
    </div>
  );
}
