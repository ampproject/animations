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

import {createImitationImg} from './imitation-img';
import {imgLoadPromise} from './testing/utils';

const {expect} = chai;
const fourByThreeUri = 'data:image/gif;base64,R0lGODdhBAADAIAAAP///////ywAAAAABAADAAACA4SPVgA7';
const threeByFourUri = 'data:image/gif;base64,R0lGODdhAwAEAIAAAP///////ywAAAAAAwAEAAACA4SPVgA7';

async function updateImg(img, fit, src) {
  img.style.objectFit = fit;
  img.src = src;
  await imgLoadPromise(img);
}

describe('createImitationImg', () => {
  let testContainer;
  let img;

  beforeEach(() => {
    img = document.createElement('img');
    testContainer = document.createElement('div');
    testContainer.appendChild(img);
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.body.removeChild(testContainer);
  });

  describe('for object-fit: contain', () => {
    beforeEach(async () => {
      await updateImg(img, 'contain', threeByFourUri);
      img.style.width = '10px';
      img.style.height = '10px';
    });

    describe('the scaleElement', () => {
      it('should size correctly', async () => {
        const {scaleElement} = createImitationImg(img);
        testContainer.appendChild(scaleElement);

        const {width, height} = scaleElement.getBoundingClientRect();
        expect(width).to.equal(10);
        expect(height).to.equal(10);
      });
    });

    describe('the img', () => {
      let scaleElement;
      let replacementImg;

      beforeEach(() => {
        const replacement = createImitationImg(img);
        scaleElement = replacement.scaleElement;
        replacementImg = replacement.img;
        testContainer.appendChild(scaleElement);
        scaleElement.style.position = 'fixed';
        scaleElement.style.top = '10px';
        scaleElement.style.left = '10px';
      })

      it('should size correctly', async () => {
        const {width, height} = replacementImg.getBoundingClientRect();
        expect(width).to.equal(7.5);
        expect(height).to.equal(10);
      });

      it('should position correctly', async () => {
        const {left, top} = replacementImg.getBoundingClientRect();
        expect(left).to.equal(11.25);
        expect(top).to.equal(10);
      });
    });
  });

  describe('for object-fit: cover', () => {
    describe('for portrait images', () => {
      beforeEach(async () => {
        await updateImg(img, 'cover', threeByFourUri);
        img.style.width = '10px';
        img.style.height = '10px';
      });
  
      describe('the img', () => {
        let replacementImg;
  
        beforeEach(() => {
          const replacement = createImitationImg(img);
          const scaleElement = replacement.scaleElement;
          replacementImg = replacement.img;
          testContainer.appendChild(scaleElement);
          scaleElement.style.position = 'fixed';
          scaleElement.style.top = '100px';
          scaleElement.style.left = '100px';
        })
  
        it('should size correctly', async () => {
          const {width, height} = replacementImg.getBoundingClientRect();
          expect(width).to.equal(10);
          expect(height).to.be.closeTo(13.333, 0.1);
        });
  
        it('should position correctly', async () => {
          const {left, top} = replacementImg.getBoundingClientRect();
          expect(left).to.equal(100);
          expect(top).to.be.closeTo(98.333, 0.1);
        });
      });
    });

    describe('for landscape images', () => {
      beforeEach(async () => {
        await updateImg(img, 'cover', fourByThreeUri);
        img.style.width = '10px';
        img.style.height = '10px';
      });

      describe('the img', () => {
        let replacementImg;

        beforeEach(() => {
          const replacement = createImitationImg(img);
          const scaleElement = replacement.scaleElement;
          replacementImg = replacement.img;
          testContainer.appendChild(scaleElement);
          scaleElement.style.position = 'fixed';
          scaleElement.style.top = '100px';
          scaleElement.style.left = '100px';
        })

        it('should size correctly', async () => {
          const {width, height} = replacementImg.getBoundingClientRect();
          expect(width).to.be.closeTo(13.333, 0.1);
          expect(height).to.equal(10);
        });

        it('should position correctly', async () => {
          const {left, top} = replacementImg.getBoundingClientRect();
          expect(left).to.be.closeTo(98.333, 0.1);
          expect(top).to.equal(100);
        });
      });
    });
  });
});
