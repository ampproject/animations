/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: 'index.ts',
    output: {
      file: 'dist/animations.js',
      format: 'cjs',
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs({ include: 'node_modules/**' }),
      typescript({
        include: '**/*.ts',
      }),
      process.env.ROLLUP_WATCH ? null : compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        externs: 'compile/externs.js'
      }),
      process.env.ROLLUP_WATCH ? null : terser(),
    ],
  },
  {
    input: 'index.ts',
    output: {
      file: 'dist/animations.mjs',
      format: 'esm',
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs({ include: 'node_modules/**' }),
      typescript({
        include: '**/*.ts',
      }),
      process.env.ROLLUP_WATCH ? null : compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        externs: 'compile/externs.js'
      }),
      process.env.ROLLUP_WATCH ? null : terser(),
    ],
  },
];
