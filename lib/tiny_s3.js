import AWS from 'aws-sdk';
import imageSize from 'image-size';
import imageType from 'image-type';
import { findSetting, getOrgSettings } from '../lib/settings';

export default {
  /*
.* This uploads an image in the Google Doc to S3
.* destination URL determined by: Organization Name, Article Title, and image ID
.*/
  upload: async function upload(
    oauthToken,
    imageID,
    contentUri,
    articleSlug,
    site
  ) {
    const apiUrl = process.env.HASURA_API_URL;
    const settingsResult = await getOrgSettings({
      url: apiUrl,
      site: site,
    });

    if (settingsResult.errors) {
      console.error(
        'DocAPI TinyS3.upload settings error:',
        settingsResult.errors
      );
      throw settingsResult.errors;
    }

    const settings = settingsResult.data.settings;
    const AWS_ACCESS_KEY_ID = findSetting(settings, 'TNC_AWS_ACCESS_ID');
    const AWS_SECRET_KEY = findSetting(settings, 'TNC_AWS_ACCESS_KEY');
    const AWS_BUCKET = findSetting(settings, 'TNC_AWS_BUCKET_NAME');

    const s3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_KEY,
    });

    var objectName = 'image' + imageID;

    // get the image data from google first
    let imageData;
    let imageDimensions;
    let imageExtension;
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
          imageExtension = imageType(buffer);
          // console.log('imageDims:', imageDimensions);
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

    let destinationPath = `${site}/${articleSlug}/${objectName}.${imageExtension.ext}`;
    // console.log('GOT IMAGE FROM GOOGLE! ', destinationPath);
    params.Key = destinationPath;
    params.ContentType = imageExtension.mime;
    params.ACL = 'public-read';

    console.log('uploading image:', params, imageDimensions);

    try {
      // console.log('token:', oauthToken);
      const data = await s3.upload(params).promise();
      // console.log('uploadImage const data:', data);
      let imageData = {
        s3Url: `https://${process.env.NEXT_PUBLIC_ASSETS_DOMAIN}/${destinationPath}`,
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
