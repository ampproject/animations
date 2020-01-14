/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

const MagicString = require('magic-string');
const walk = require('acorn-walk');

export function removeEmptySpace() {
  return {
    name: 'remove-empty-space',
    transform(code) {
      const source = new MagicString(code);
      const program = this.parse(code, { ranges: true });

      walk.simple(program, {
        TemplateLiteral(node) {
          const [start, end] = node.range;
          let literalValue = code.substring(start, end);
          literalValue = literalValue
            .replace(/\) \{/g, '){')
            .replace(/, /g, ',')
            .replace(/ = /g, '=')
            .replace(/\t/g, '')
            .replace(/[ ]{2,}/g, '')
            .replace(/\n/g, '');
          source.overwrite(start, end, literalValue);
        },
      });

      return {
        code: source.toString(),
        map: source.generateMap(),
      };
    },
  };
}
