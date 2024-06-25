import path from 'path';

export default {
  rcEntry: path.resolve(__dirname, '../react-components/src/index.ts'),
  rcStyleEntry: path.resolve(__dirname, '../react-components/src/index.less'),
  rcBabelConfig: path.resolve(__dirname, '../react-components/babel.config.js'),
  rcDist: path.resolve(__dirname, '../react-components/dist/index.js'),
  rcDistStyle: path.resolve(__dirname, '../react-components/dist/index.css'),

  /* engine */
  engineEntry: path.resolve(__dirname, '../engine/src/index.new.ts'),
  engineDist: path.resolve(__dirname, '../engine/dist/index.js'),
  engineTsConfig: path.resolve(__dirname, '../engine/tsconfig.json'),
  engineBabelConfig: path.resolve(__dirname, '../engine/babel.config.js'),
};
