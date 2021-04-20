import React, { useEffect, useRef, useState } from 'react';
import S3 from 'react-aws-s3';
import tw from 'twin.macro';

const UploadButton = tw.input`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-700 hover:bg-blue-500 text-white md:rounded`;
export default function Upload(props) {
  const fileInput = useRef();
  const [imageSrc, setImageSrc] = useState(props.bioImage);
  const [randomKey, setRandomKey] = useState(Math.random());

  useEffect(() => {
    if (props.bioImage) {
      setImageSrc(props.bioImage);
    }
  }, [props.bioImage]);

  const handleClick = (event) => {
    event.preventDefault();

    let file = fileInput.current.files[0];
    let newFilename = 'authors/' + props.slug; // ;

    const ReactS3Client = new S3(props.awsConfig);
    ReactS3Client.uploadFile(file, newFilename)
      .then((data) => {
        if (data.status === 204) {
          props.setBioImage(data.location);
          setImageSrc(data.location + '?' + Math.random());
          setRandomKey(Math.random());
          props.setNotificationMessage('Successfully uploaded the image');
          props.setNotificationType('success');
          props.setShowNotification(true);
        } else {
          console.log('failed uploading image:', data);
          props.setNotificationMessage(
            'An error occurred while uploading the image:',
            JSON.stringify(data)
          );
          props.setNotificationType('error');
          props.setShowNotification(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <img src={imageSrc} key={randomKey} />
      <form className="upload-steps" onSubmit={handleClick}>
        <input className="file-input" type="file" ref={fileInput} />
        <UploadButton type="submit" value="Upload" />
      </form>
    </>
  );
}
