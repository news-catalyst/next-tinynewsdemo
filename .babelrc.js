module.exports = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: [
    'babel-plugin-macros',
    [
      'babel-plugin-styled-components',
      { ssr: true, displayName: true, preprocess: false },
    ],
  ],
};
