import path from 'path';

export default {
  rcEntry: path.resolve(__dirname, '../react-components/src/index.ts'),
  rcDist: path.resolve(__dirname, '../react-components/dist/index.js'),
  rcBabelConfig: path.resolve(__dirname, '../react-components/babel.config.js'),
  rcStyle: path.resolve(__dirname, '../react-components/src/index.less'),

  /* engine */
  engineEntry: path.resolve(__dirname, '../engine/src/index.new.ts'),
  engineDist: path.resolve(__dirname, '../engine/dist/index.js'),
  engineTsConfig: path.resolve(__dirname, '../engine/tsconfig.json'),
  engineBabelConfig: path.resolve(__dirname, '../engine/babel.config.js'),
};
