require('dotenv').config({ path: '.env.local' })

module.exports = {
  images: {
    domains: [
      'tnc-test-upload-bucket.s3.amazonaws.com',
      'tiny-news-demo-assets-dev.s3.amazonaws.com',
      'wherebyspace.nyc3.digitaloceanspaces.com',
      'tiny-news-demo-assets-oaklyn.s3.amazonaws.com',
      'tnc-test-upload-bucket.s3.us-east-1.amazonaws.com',
    ],
  },
  i18n: {
    locales: process.env.LOCALES.split(','),
    defaultLocale: 'en-US',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Unset client-side javascript that only works server-side
      // https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
      config.node = { fs: 'empty', module: 'empty' }
    }

    return config
  },

}
