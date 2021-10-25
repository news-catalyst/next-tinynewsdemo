import React, { useEffect, useRef, useState } from 'react';
import S3 from 'react-aws-s3';
import tw from 'twin.macro';

const UploadButton = tw.input`hidden md:flex md:w-auto px-4 py-2 text-right bg-blue-700 hover:bg-blue-500 text-white md:rounded text-center cursor-pointer`;
const ImgWrapper = tw.div`w-40 h-auto`;

export default function Upload(props) {
  const fileInput = useRef();
  const [imageSrc, setImageSrc] = useState(props.image);
  const [randomKey, setRandomKey] = useState(Math.random());

  useEffect(() => {
    if (props.image) {
      setImageSrc(props.image);
    }
  }, [props.image]);

  const handleClick = (event) => {
    event.preventDefault();

    let file = fileInput.current.files[0];
    let newFilename = `${props.folderName}/${props.slug}`;

    const ReactS3Client = new S3(props.awsConfig);
    ReactS3Client.uploadFile(file, newFilename)
      .then((data) => {
        if (data.status === 204) {
          let uploadedS3Url = new URL(data.location);
          let assetUrl =
            'https://assets.tinynewsco.org' + uploadedS3Url.pathname;
          props.setter(assetUrl);

          if (props.parsedData) {
            let updatedParsedData = props.parsedData;
            updatedParsedData[props.imageKey] = assetUrl;
            props.updateParsedData(updatedParsedData);
          }

          setImageSrc(assetUrl + '?' + Math.random());
          setRandomKey(Math.random());
          props.setNotificationMessage('Successfully uploaded the image');
          props.setNotificationType('success');
          props.setShowNotification(true);
        } else {
          console.error('failed uploading image:', data);
          props.setNotificationMessage(
            'An error occurred while uploading the image:',
            data
          );
          props.setNotificationType('error');
          props.setShowNotification(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <ImgWrapper>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} key={randomKey} alt="" />
      </ImgWrapper>
      <div className="upload-steps">
        <input className="file-input" type="file" ref={fileInput} />
        <UploadButton onClick={handleClick} defaultValue="Upload" />
      </div>
    </>
  );
}
