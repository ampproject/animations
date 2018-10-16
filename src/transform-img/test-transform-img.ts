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

import {prepareImageAnimation} from './transform-img.js';
import {imgLoadPromise} from '../testing/utils.js';
import {
  setup as setupAnimations,
  tearDown as tearDownAnimations,
  offset,
} from '../testing/animation-test-controller';

const {expect} = chai;
const threeByFourUri = 'data:image/gif;base64,R0lGODdhAwAEAIAAAP///////ywAAAAAAwAEAAACA4SPVgA7';

describe('prepareImageAnimation', () => {
  let testContainer;
  let smallerImg;
  let largerImg;
  let transitionContainer;
  let cleanupAnimation;
  const curve = {x1: 0.8, y1: 0, x2: 0.2, y2: 1};
  const head = document.head!;
  const styles = {
    animationFillMode: 'forwards',
    animationDuration: '1000ms',
  };

  function getReplacement() {
    return transitionContainer.firstChild.firstChild;
  }

  function startAnimation(srcImg, targetImg) {
    const animation = prepareImageAnimation({
      transitionContainer,
      styleContainer: head,
      srcImg,
      targetImg,
      styles,
      curve,
    });
    animation.applyAnimation();
    cleanupAnimation = animation.cleanupAnimation;
  }

  async function updateImg(img, fit, src) {
    img.style.objectFit = fit;
    img.src = src;
    await imgLoadPromise(img);
  }

  before(() => {
    setupAnimations();
  });

  after(() => {
    tearDownAnimations();
  });

  beforeEach(() => {
    cleanupAnimation = () => {};
    smallerImg = document.createElement('img');
    smallerImg.style.position = 'fixed';
    largerImg = document.createElement('img');
    largerImg.style.position = 'fixed';
    testContainer = document.createElement('div');
    transitionContainer = document.createElement('div');
    testContainer.appendChild(smallerImg);
    testContainer.appendChild(largerImg);
    document.body.appendChild(testContainer);  
    document.body.appendChild(transitionContainer);  
  });

  afterEach(() => {
    cleanupAnimation();
    document.body.removeChild(testContainer);
  });

  describe('smaller to larger', () => {
    beforeEach(async () => {
      await updateImg(smallerImg, 'contain', threeByFourUri);
      smallerImg.style.width = '12px';
      smallerImg.style.height = '12px';
      smallerImg.style.top = '500px';
      smallerImg.style.left = '100px';
      await updateImg(largerImg, 'contain', threeByFourUri);
      largerImg.style.width = '24px';
      largerImg.style.height = '32px';
      largerImg.style.top = '10px';
      largerImg.style.left = '10px';
    });

    it('should start with the correct size and position', () => {
      startAnimation(smallerImg, largerImg);
      offset(0);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(500, 0.3);
      expect(left).to.be.closeTo(100, 0.3);
      expect(width).to.be.closeTo(12, 0.3);
      expect(height).to.be.closeTo(12, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(9, 0.3);
      expect(imgHeight).to.be.closeTo(12, 0.3);
    });

    it('should have the correct size and position 200ms in', async () => {
      startAnimation(smallerImg, largerImg);
      offset(200);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(486.6, 0.3);
      expect(left).to.be.closeTo(97.5, 0.3);
      expect(width).to.be.closeTo(12.333, 0.3);
      expect(height).to.be.closeTo(12.55, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(9.4166, 0.3);
      expect(imgHeight).to.be.closeTo(12.55, 0.3);
    });

    it('should end with the correct size and position', async () => {
      startAnimation(smallerImg, largerImg);
      offset(1000);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(10, 0.3);
      expect(left).to.be.closeTo(10, 0.3);
      expect(width).to.be.closeTo(24, 0.3);
      expect(height).to.be.closeTo(32, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(24, 0.3);
      expect(imgHeight).to.be.closeTo(32, 0.3);
    });
  });

  describe('larger to smaller', () => {
    beforeEach(async () => {
      await updateImg(smallerImg, 'contain', threeByFourUri);
      smallerImg.style.width = '12px';
      smallerImg.style.height = '12px';
      smallerImg.style.top = '500px';
      smallerImg.style.left = '100px';
      await updateImg(largerImg, 'contain', threeByFourUri);
      largerImg.style.width = '24px';
      largerImg.style.height = '32px';
      largerImg.style.top = '10px';
      largerImg.style.left = '10px';
    });

    it('should start with the correct size and position', () => {
      startAnimation(largerImg, smallerImg);
      offset(0);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(10, 0.3);
      expect(left).to.be.closeTo(10, 0.3);
      expect(width).to.be.closeTo(24, 0.3);
      expect(height).to.be.closeTo(32, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(24, 0.3);
      expect(imgHeight).to.be.closeTo(32, 0.3);
    });

    it('should have the correct size and position 200ms in', async () => {
      startAnimation(largerImg, smallerImg);
      offset(200);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(23.4, 0.3);
      expect(left).to.be.closeTo(12.5, 0.3);
      expect(width).to.be.closeTo(23.666, 0.3);
      expect(height).to.be.closeTo(31.45, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(23.583, 0.3);
      expect(imgHeight).to.be.closeTo(31.45, 0.3);
    });

    it('should end with the correct size and position', async () => {
      startAnimation(largerImg, smallerImg);
      offset(1000);

      const replacement = getReplacement();
      const {top, left, width, height} = replacement.getBoundingClientRect();
      expect(top).to.be.closeTo(500, 0.3);
      expect(left).to.be.closeTo(100, 0.3);
      expect(width).to.be.closeTo(12, 0.3);
      expect(height).to.be.closeTo(12, 0.3);

      const replacementImg = replacement.querySelector('img');
      const {
        width: imgWidth,
        height: imgHeight,
      } = replacementImg.getBoundingClientRect();
      expect(imgWidth).to.be.closeTo(9, 0.3);
      expect(imgHeight).to.be.closeTo(12, 0.3);
    });
  });
});
