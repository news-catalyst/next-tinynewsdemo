require('dotenv').config({ path: '.env.local' });

// to-do: replace d32qj1gowzeibr.cloudfront.net with assets.tinynewsco.dev
module.exports = {
  images: {
    domains: [
      'tnc-test-upload-bucket.s3.amazonaws.com',
      'tnc-staging-upload-bucket.s3.amazonaws.com',
      'assets.tinynewsco.org',
      'd32qj1gowzeibr.cloudfront.net',
      'tiny-news-demo-assets-dev.s3.amazonaws.com',
      'wherebyspace.nyc3.digitaloceanspaces.com',
      'tiny-news-demo-assets-oaklyn.s3.amazonaws.com',
      'tnc-test-upload-bucket.s3.us-east-1.amazonaws.com',
      'ucarecdn.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
};
