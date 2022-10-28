module.exports = {
  presets: [
    [
      'next/babel',
      { 'preset-env': {}, 'preset-react': { runtime: 'automatic' } },
    ],
  ],
  plugins: [
    'babel-plugin-macros',
    [
      'babel-plugin-styled-components',
      { ssr: true, displayName: true, preprocess: false },
    ],
    '@babel/plugin-proposal-private-methods',
  ],
};
