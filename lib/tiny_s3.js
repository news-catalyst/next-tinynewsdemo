import AWS from 'aws-sdk';
import imageSize from 'image-size';

export default {
  /*
.* This uploads an image in the Google Doc to S3
.* destination URL determined by: Organization Name, Article Title, and image ID
.*/
  upload: async function upload(oauthToken, imageID, contentUri, articleSlug) {
    var AWS_ACCESS_KEY_ID = process.env.TNC_AWS_ACCESS_ID;
    var AWS_SECRET_KEY = process.env.TNC_AWS_ACCESS_KEY;
    var AWS_BUCKET = process.env.TNC_AWS_BUCKET_NAME;

    const s3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_KEY,
    });

    var orgNameSlug = process.env.ORG_SLUG;

    var objectName = 'image' + imageID + '.png'; // TODO use real file ext

    // get the image data from google first
    let imageData;
    let imageDimensions;
    let buffer;
    const response = await fetch(contentUri, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + oauthToken },
    });

    let params = {
      Bucket: AWS_BUCKET,
    };
    if (response.ok) {
      imageData = await response.blob();

      if (imageData) {
        try {
          buffer = await imageData.arrayBuffer();
          buffer = Buffer.from(buffer);
          params.Body = buffer;
          imageDimensions = imageSize(buffer);
          console.log('imageDims:', imageDimensions);
        } catch (e) {
          console.error(
            'error getting size of imageData buffer:',
            typeof buffer,
            e
          );
        }
      }
    } else {
      console.error('Failed to fetch image data for uri: ', contentUri);
      return null;
    }

    let destinationPath = orgNameSlug + '/' + articleSlug + '/' + objectName;
    // console.log('GOT IMAGE FROM GOOGLE! ', destinationPath);
    params.Key = destinationPath;

    try {
      // console.log('token:', oauthToken);
      const data = await s3.upload(params).promise();
      console.log('uploadImage const data:', data);
      let imageData = {
        s3Url: 'https://assets.tinynewsco.org/' + destinationPath,
        height: imageDimensions.height,
        width: imageDimensions.width,
      };
      // console.log('uploaded data:', imageData);
      return imageData;
    } catch (err) {
      console.error('Error uploading to S3:', err);
      return null;
    }
  },
};
