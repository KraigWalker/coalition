import { builtinModules } from 'module';
//import { execSync } from 'child_process';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { entryManifest } from './plugins/entryManifest.js';

import pkg from './package.json' assert { type: 'json' };
const manifest = entryManifest();

const buildId = 'test';
//  process.env.BUILD_ID ||
//  execSync('git rev-parse --short HEAD').toString().trim();

const dependencies = (
  process.env.NODE_ENV === 'development'
    ? Object.keys(pkg.dependencies).concat(
        Object.keys(pkg.devDependencies || {})
      )
    : Object.keys(pkg.dependencies)
)
  .concat('react-dom/server')
  .concat('react-dom/client');

/**
 * The bundle that build the server-side version of the client to render and stream views to the browser.
 */
const server = {
  external: builtinModules.concat(dependencies),
  input: './src/server.js',
  output: { dir: 'build', format: 'esm' },
  preserveEntrySignatures: 'strict',
  plugins: [
    manifest.inject({ virtualId: 'entry-manifest' }),
    babel({ exclude: /node_modules/, babelHelpers: 'bundled', babelrc: true }),
    json(),
    resolve(),
    commonjs(),
    url({
      limit: 5 * 1024,
      publicPath: '/_client/',
      emitFiles: false,
    }),
    replace({
      'process.env.IS_SERVER': true,
      'process.env.NODE_ENV': "'production'",
      'process.env.BUILD_ID': buildId, //JSON.stringify(buildId),
      preventAssignment: true,
    }),
  ],
};

/**
 * The bundle that build the client (browser) version uses with interactivity.
 */
const client = {
  external: builtinModules,
  input: './src/client/index.js',
  output: { dir: 'build/client', format: 'es' },
  preserveEntrySignatures: false,
  plugins: [
    manifest.inject({ virtualId: 'entry-manifest' }),
    babel({ exclude: /node_modules/, babelHelpers: 'bundled', babelrc: true }),
    json(),
    resolve(),
    commonjs(),
    url({
      limit: 5 * 1024,
      publicPath: '/_client/',
      emitFiles: false,
    }),
    replace({
      'process.env.IS_SERVER': false,
      'process.env.NODE_ENV': "'production'",
      'process.env.BUILD_ID': buildId, //JSON.stringify(buildId),
      preventAssignment: true,
    }),
  ],
};

const config = [server, client];

export default config;
