import paths from './paths.mjs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

export default {
  input: paths.engineEntry,
  output: {
    file: paths.engineDist,
    format: 'es',
  },
  plugins: [
    babel({ babelHelpers: 'bundled', extensions: ['.ts', '.js'], configFile: paths.engineBabelConfig }),
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    terser(),
  ],
};
