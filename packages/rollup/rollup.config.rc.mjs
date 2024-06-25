import paths from './paths.mjs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: paths.rcEntry,
    output: {
      file: paths.rcDist,
      format: 'umd',
      name: 'LAZY_MONKEY_GridEngineRC',
    },
    external: ['react', 'react-dom', 'classnames'],
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
      }),

      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),

      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
        configFile: paths.rcBabelConfig,
      }),

      terser(),
    ],
  },
  {
    input: paths.rcStyleEntry,
    output: {
      file: paths.rcDistStyle,
    },
    plugins: [
      postcss({
        extract: true,
        use: ['less'],
      }),
    ],
  },
];
