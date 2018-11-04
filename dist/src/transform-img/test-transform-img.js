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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prepareImageAnimation } from './transform-img.js';
import { imgLoadPromise } from '../testing/utils.js';
import { setup as setupAnimations, tearDown as tearDownAnimations, offset, } from '../testing/animation-test-controller';
/**
 * Used to make sure an expected position, width or height is close to the
 * actual value. This is a bit larger than ideal as Chrome/Firefox have
 * substantially different values part way through the animation (at any
 * given time).
 */
const COMPARISON_EPSILON = 0.3;
const { expect } = chai;
const threeByFourUri = 'data:image/gif;base64,R0lGODdhAwAEAIAAAP///////ywAAAAAAwAEAAACA4SPVgA7';
describe('prepareImageAnimation', () => {
    let testContainer;
    let smallerImg;
    let largerImg;
    let transitionContainer;
    let cleanupAnimation;
    const curve = { x1: 0.8, y1: 0, x2: 0.2, y2: 1 };
    const head = document.head;
    const styles = {
        'animationDuration': '1000ms',
    };
    function getIntermediateImg() {
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
    function updateImg(img, fit, src) {
        return __awaiter(this, void 0, void 0, function* () {
            img.style.objectFit = fit;
            img.src = src;
            yield imgLoadPromise(img);
        });
    }
    before(() => {
        setupAnimations();
    });
    after(() => {
        tearDownAnimations();
    });
    beforeEach(() => {
        cleanupAnimation = () => { };
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
        document.body.removeChild(transitionContainer);
        document.body.removeChild(testContainer);
    });
    describe('smaller to larger', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(smallerImg, 'contain', threeByFourUri);
            smallerImg.style.width = '12px';
            smallerImg.style.height = '12px';
            smallerImg.style.top = '500px';
            smallerImg.style.left = '100px';
            yield updateImg(largerImg, 'contain', threeByFourUri);
            largerImg.style.width = '24px';
            largerImg.style.height = '32px';
            largerImg.style.top = '10px';
            largerImg.style.left = '10px';
        }));
        it('should start with the correct size and position', () => {
            startAnimation(smallerImg, largerImg);
            offset(0);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // smallerImg.style.top
            expect(top).to.be.closeTo(500, COMPARISON_EPSILON);
            // smallerImg.style.left
            expect(left).to.be.closeTo(100, COMPARISON_EPSILON);
            // smallerImg.style.width
            expect(width).to.be.closeTo(12, COMPARISON_EPSILON);
            // smallerImg.style.height
            expect(height).to.be.closeTo(12, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // 3/4 * smallerImg.style.height (contain)
            expect(imgWidth).to.be.closeTo(9, COMPARISON_EPSILON);
            // smallerImg.style.height
            expect(imgHeight).to.be.closeTo(12, COMPARISON_EPSILON);
        });
        it('should have the correct size and position 200ms in', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(smallerImg, largerImg);
            offset(200);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // 20% of the animation, starting from 500, going to 10
            expect(top).to.be.closeTo(486.6, COMPARISON_EPSILON);
            // 20% of the animation, starting from 100, going to 10
            expect(left).to.be.closeTo(97.5, COMPARISON_EPSILON);
            // 20% of the animation, starting from 12, going to 24
            expect(width).to.be.closeTo(12.333, COMPARISON_EPSILON);
            // 20% of the animation, starting from 12, going to 32
            expect(height).to.be.closeTo(12.55, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // 20% of the animation, starting from 9, going to 24
            expect(imgWidth).to.be.closeTo(9.4166, COMPARISON_EPSILON);
            // 20% of the animation, starting from 12, going to 32
            expect(imgHeight).to.be.closeTo(12.55, COMPARISON_EPSILON);
        }));
        it('should end with the correct size and position', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(smallerImg, largerImg);
            offset(1000);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // largerImg.style.top
            expect(top).to.be.closeTo(10, COMPARISON_EPSILON);
            // largerImg.style.left
            expect(left).to.be.closeTo(10, COMPARISON_EPSILON);
            // largerImg.style.width
            expect(width).to.be.closeTo(24, COMPARISON_EPSILON);
            // largerImg.style.height
            expect(height).to.be.closeTo(32, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // largerImg.style.width
            expect(imgWidth).to.be.closeTo(24, COMPARISON_EPSILON);
            // largerImg.style.height
            expect(imgHeight).to.be.closeTo(32, COMPARISON_EPSILON);
        }));
    });
    describe('larger to smaller', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(smallerImg, 'contain', threeByFourUri);
            smallerImg.style.width = '12px';
            smallerImg.style.height = '12px';
            smallerImg.style.top = '500px';
            smallerImg.style.left = '100px';
            yield updateImg(largerImg, 'contain', threeByFourUri);
            largerImg.style.width = '24px';
            largerImg.style.height = '32px';
            largerImg.style.top = '10px';
            largerImg.style.left = '10px';
        }));
        it('should start with the correct size and position', () => {
            startAnimation(largerImg, smallerImg);
            offset(0);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // largerImg.style.top
            expect(top).to.be.closeTo(10, COMPARISON_EPSILON);
            // largerImg.style.left
            expect(left).to.be.closeTo(10, COMPARISON_EPSILON);
            // largerImg.style.width
            expect(width).to.be.closeTo(24, COMPARISON_EPSILON);
            // largerImg.style.height
            expect(height).to.be.closeTo(32, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // largerImg.style.width
            expect(imgWidth).to.be.closeTo(24, COMPARISON_EPSILON);
            // largerImg.style.height
            expect(imgHeight).to.be.closeTo(32, COMPARISON_EPSILON);
        });
        it('should have the correct size and position 200ms in', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(largerImg, smallerImg);
            offset(200);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // 20% of the animation, starting from 10, going to 500
            expect(top).to.be.closeTo(23.4, COMPARISON_EPSILON);
            // 20% of the animation, starting from 10, going to 100
            expect(left).to.be.closeTo(12.5, COMPARISON_EPSILON);
            // 20% of the animation, starting from 24, going to 12
            expect(width).to.be.closeTo(23.666, COMPARISON_EPSILON);
            // 20% of the animation, starting from 32, going to 12
            expect(height).to.be.closeTo(31.45, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // 20% of the animation, starting from 24, going to 9
            expect(imgWidth).to.be.closeTo(23.583, COMPARISON_EPSILON);
            // 20% of the animation, starting from 32, going to 12
            expect(imgHeight).to.be.closeTo(31.45, COMPARISON_EPSILON);
        }));
        it('should end with the correct size and position', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(largerImg, smallerImg);
            offset(1000);
            const replacement = getIntermediateImg();
            const { top, left, width, height } = replacement.getBoundingClientRect();
            // smallerImg.style.top
            expect(top).to.be.closeTo(500, COMPARISON_EPSILON);
            // smallerImg.style.left
            expect(left).to.be.closeTo(100, COMPARISON_EPSILON);
            // smallerImg.style.width
            expect(width).to.be.closeTo(12, COMPARISON_EPSILON);
            // smallerImg.style.height
            expect(height).to.be.closeTo(12, COMPARISON_EPSILON);
            const replacementImg = replacement.querySelector('img');
            const { width: imgWidth, height: imgHeight, } = replacementImg.getBoundingClientRect();
            // 3/4 * smallerImg.style.height (contain)
            expect(imgWidth).to.be.closeTo(9, COMPARISON_EPSILON);
            // smallerImg.style.height
            expect(imgHeight).to.be.closeTo(12, COMPARISON_EPSILON);
        }));
    });
    describe('scrolling', () => {
        let sizer;
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            sizer = document.createElement('div');
            sizer.style.height = `${window.innerHeight * 2}px`;
            sizer.style.width = `${window.innerWidth * 2}px`;
            document.body.appendChild(sizer);
            yield updateImg(smallerImg, 'contain', threeByFourUri);
            smallerImg.style.width = '12px';
            smallerImg.style.height = '12px';
            smallerImg.style.top = '500px';
            smallerImg.style.left = '100px';
            yield updateImg(largerImg, 'contain', threeByFourUri);
            largerImg.style.width = '24px';
            largerImg.style.height = '32px';
            largerImg.style.top = '10px';
            largerImg.style.left = '10px';
        }));
        afterEach(() => {
            document.body.removeChild(sizer);
            window.scrollTo(0, 0);
        });
        it('should have the correct position 200ms in', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(largerImg, smallerImg);
            offset(200);
            window.scrollTo(50, 75);
            const replacement = getIntermediateImg();
            const { top, left } = replacement.getBoundingClientRect();
            // 20% of the animation, starting from 10, going to 500 - 75 from scroll
            expect(top).to.be.closeTo(-51.5, COMPARISON_EPSILON);
            // 20% of the animation, starting from 10, going to 100 - 50 from scroll
            expect(left).to.be.closeTo(-37.5, COMPARISON_EPSILON);
        }));
        it('should end with the correct position', () => __awaiter(this, void 0, void 0, function* () {
            startAnimation(largerImg, smallerImg);
            offset(1000);
            window.scrollTo(50, 75);
            const replacement = getIntermediateImg();
            const { top, left } = replacement.getBoundingClientRect();
            // smallerImg.style.top - 75 from scroll
            expect(top).to.be.closeTo(425, COMPARISON_EPSILON);
            // smallerImg.style.left - 50 from scroll
            expect(left).to.be.closeTo(50, COMPARISON_EPSILON);
        }));
    });
});
//# sourceMappingURL=test-transform-img.js.map