import tw from 'twin.macro';

export default function Notification(props) {
  let messages = props.message;
  if (typeof props.message === 'string') {
    messages = [props.message];
  }
  let alertBox;
  console.log('props:', props);
  if (props.notificationType === 'success') {
    alertBox = (
      <div tw="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <strong tw="font-bold">Success!</strong>{' '}
        {messages.map((msg) => (
          <span key={msg} tw="block sm:inline">
            {msg}
          </span>
        ))}
      </div>
    );
  } else {
    alertBox = (
      <div tw="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong tw="font-bold">Uh oh!</strong>
        <span tw="block sm:inline">Something went wrong...</span>
        {messages.map((msg) => (
          <span key={msg} tw="block sm:inline">
            {msg}
          </span>
        ))}
      </div>
    );
  }
  return alertBox;
}
