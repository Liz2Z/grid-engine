module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: ['> 1% in alt-as', 'Chrome >= 49', 'ie >= 10', 'not ie <= 8', 'firefox >= 78', 'safari >= 10'],
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
};
