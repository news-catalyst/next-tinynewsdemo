export default function Notification(props) {
  return (
    <div className={`notification is-${props.notificationType}`}>
      <button
        className="delete"
        onClick={() => props.setShowNotification(false)}
      ></button>
      {props.message}
    </div>
  );
}
