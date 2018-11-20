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

import {getPositioningTranslate} from './object-position.js';

const {expect} = chai;

describe('getPositioningTranslate', () => {
  function getComputedObjectPosition(position) {
    const div = document.createElement('div');
    div.style.setProperty('object-position', position);

    document.body.appendChild(div);
    const computed = getComputedStyle(div).getPropertyValue('object-position');
    document.body.removeChild(div);

    return computed;
  }

  it('should return the correct value for center', () => {
    const position = getComputedObjectPosition('center center');
    const {top, left} = getPositioningTranslate(position, {
      width: 100,
      height: 100,
    }, {
      width: 75,
      height: 50,
    });

    expect(left).to.equal(12.5); // (100 - 75) / 2
    expect(top).to.equal(25); // (100 - 50) / 2
  });

  describe('top/left', () => {
    it('should return the correct value', () => {
      const position = getComputedObjectPosition('top left');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });
  
      expect(left).to.equal(0);
      expect(top).to.equal(0);
    });
  
    it('should return the correct value for px offsets', () => {
      const position = getComputedObjectPosition('top 2px left 2px');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });
  
      expect(left).to.equal(2); // 0 + 2
      expect(top).to.equal(2); // 0 + 2
    });

    it('should return the correct value for calc offsets', () => {
      const position = getComputedObjectPosition(
          'top calc(10% - 2px) left calc(10% - 2px)');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });
  
      expect(left).to.equal(0.5); // 0.1 * (100 - 75) - 2
      expect(top).to.equal(3); // 0.1 * (100 - 50) - 2
    });
  });

  describe('bottom/right', () => {
    it('should return the correct value', () => {
      const position = getComputedObjectPosition('bottom right');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });

      expect(left).to.equal(25); // 100 - 75
      expect(top).to.equal(50); // 100 - 50
    });

    it('should return the correct value for px offsets', () => {
      const position = getComputedObjectPosition('bottom -2px right -2px');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });

      expect(left).to.equal(27); // 100 - 75 + 2
      expect(top).to.equal(52); // 100 - 50 + 2
    });

    it('should return the correct value for calc offsets', () => {
      const position = getComputedObjectPosition(
          'bottom calc(10% + 2px) right calc(10% + 2px)');
      const {top, left} = getPositioningTranslate(position, {
        width: 100,
        height: 100,
      }, {
        width: 75,
        height: 50,
      });
  
      expect(left).to.equal(20.5); // 0.9 * (100 - 75) - 2
      expect(top).to.equal(43); // 0.9 * (100 - 50) - 2
    });
  });
});