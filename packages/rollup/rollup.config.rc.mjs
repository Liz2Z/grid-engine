import paths from './paths.mjs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy-assets';

export default {
  input: paths.rcEntry,
  output: {
    file: paths.rcDist,
    format: 'es',
  },
  external: ['react', 'react-dom', 'classnames'],
  plugins: [
    babel({ babelHelpers: 'bundled', extensions: ['.ts', '.js', '.jsx', '.tsx'], configFile: paths.rcBabelConfig }),
    nodeResolve({
      extensions: ['.ts', '.js', '.jsx', '.tsx'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    terser(),

    copy({
      assets: ['./index.less'],
    }),
  ],
};
