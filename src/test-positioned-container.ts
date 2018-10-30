/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

import {getPositionedContainer} from './positioned-container.js';

const {expect} = chai;

describe('getPositionedParent', () => {
  let child;
  let grandchild;

  beforeEach(() => {
    child = document.createElement('div');
    grandchild = document.createElement('div');
    child.appendChild(grandchild);
    document.body.appendChild(child);
  });

  afterEach(() => {
    document.body.style.cssText = '';
    document.body.removeChild(child);
  });

  describe('for a positioned body', () => {
    beforeEach(() => {
      document.body.style.position = 'relative';
    });

    it('should return the correct element for body', () => {
      const container = getPositionedContainer(document.body);
      expect(container).to.equal(document.body);
    });

    it('should return the correct element for a child', () => {
      const container = getPositionedContainer(child);
      expect(container).to.equal(document.body);
    });

    it('should return the correct element for a grandchild', () => {
      const container = getPositionedContainer(grandchild);
      expect(container).to.equal(document.body);
    });

    it('should return the correct element for a grandchild with positioned parent', () => {
      child.style.position = 'relative';

      const container = getPositionedContainer(grandchild);
      expect(container).to.equal(child);
    });
  });

  describe('for a non positioned body', () => {
    it('should return the correct element for body', () => {
      const container = getPositionedContainer(document.body);
      expect(container).to.equal(document.documentElement);
    });

    it('should return the correct element for a child', () => {
      const container = getPositionedContainer(child);
      expect(container).to.equal(document.documentElement);
    });

    it('should return the correct element for a grandchild', () => {
      const container = getPositionedContainer(grandchild);
      expect(container).to.equal(document.documentElement);
    });

    it('should return the correct element for a grandchild with positioned parent', () => {
      child.style.position = 'relative';

      const container = getPositionedContainer(grandchild);
      expect(container).to.equal(child);
    });
  });
});
