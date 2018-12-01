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
import { createIntermediateImg } from './intermediate-img';
import { imgLoadPromise } from './testing/utils';
const { expect } = chai;
const fourByThreeUri = 'data:image/gif;base64,R0lGODdhBAADAIAAAP///////ywAAAAABAADAAACA4SPVgA7';
const threeByFourUri = 'data:image/gif;base64,R0lGODdhAwAEAIAAAP///////ywAAAAAAwAEAAACA4SPVgA7';
const testLeft = 0;
const testTop = 0;
const testWidth = 10;
const testHeight = 10;
function updateImg(img, fit, position, src) {
    return __awaiter(this, void 0, void 0, function* () {
        img.style.objectFit = fit;
        img.style.objectPosition = position;
        img.src = src;
        yield imgLoadPromise(img);
    });
}
describe('createIntermediateImg', () => {
    let testContainer;
    let srcImg;
    beforeEach(() => {
        srcImg = document.createElement('img');
        testContainer = document.createElement('div');
        testContainer.appendChild(srcImg);
        document.body.appendChild(testContainer);
    });
    afterEach(() => {
        document.body.removeChild(testContainer);
    });
    describe('for object-fit: contain', () => {
        beforeEach(() => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(srcImg, 'contain', 'initial', threeByFourUri);
            srcImg.style.width = `${testWidth}px`;
            srcImg.style.height = `${testHeight}px`;
        }));
        describe('the scaleElement', () => {
            it('should size correctly', () => __awaiter(this, void 0, void 0, function* () {
                const { scaleElement } = createIntermediateImg(srcImg);
                testContainer.appendChild(scaleElement);
                const { width, height } = scaleElement.getBoundingClientRect();
                expect(width).to.equal(testWidth);
                expect(height).to.equal(testHeight);
            }));
        });
        describe('the img', () => {
            let imgElement;
            beforeEach(() => {
                const { img, scaleElement } = createIntermediateImg(srcImg);
                imgElement = img;
                testContainer.appendChild(scaleElement);
                scaleElement.style.position = 'fixed';
                scaleElement.style.top = `${testTop}px`;
                scaleElement.style.left = `${testLeft}px`;
            });
            it('should size correctly', () => __awaiter(this, void 0, void 0, function* () {
                const { width, height } = imgElement.getBoundingClientRect();
                // (3/4) * testHeight
                expect(width).to.equal(7.5);
                // Larger dimension is height, so should match testHeight
                expect(height).to.equal(10);
            }));
            it('should position correctly', () => __awaiter(this, void 0, void 0, function* () {
                const { left, top } = imgElement.getBoundingClientRect();
                // Should center the horizontal and has a width of 7.5
                // testLeft + (testWidth - ((3/4) * testWidth)) / 2 = 1.25
                expect(left).to.equal(1.25);
                // Height matches testHeight, so centered at testTop
                expect(top).to.equal(0);
            }));
        });
    });
    describe('for object-fit: cover', () => {
        describe('for portrait images', () => {
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield updateImg(srcImg, 'cover', 'initial', threeByFourUri);
                srcImg.style.width = `${testWidth}px`;
                srcImg.style.height = `${testHeight}px`;
            }));
            describe('the img', () => {
                let imgElement;
                beforeEach(() => {
                    const { img, scaleElement } = createIntermediateImg(srcImg);
                    imgElement = img;
                    testContainer.appendChild(scaleElement);
                    scaleElement.style.position = 'fixed';
                    scaleElement.style.top = `${testTop}px`;
                    scaleElement.style.left = `${testLeft}px`;
                });
                it('should size correctly', () => __awaiter(this, void 0, void 0, function* () {
                    const { width, height } = imgElement.getBoundingClientRect();
                    // Smaller dimension is width, so should match testWidth
                    expect(width).to.equal(10);
                    // (4/3) * testWidth
                    expect(height).to.be.closeTo(13.333, 0.1);
                }));
                it('should position correctly', () => __awaiter(this, void 0, void 0, function* () {
                    const { left, top } = imgElement.getBoundingClientRect();
                    // Width matches testWidth, so centered at testLeft
                    expect(left).to.equal(0);
                    // Should center the vertical and has a height of 13.333
                    // testLeft + (testWidth - ((4/3) * testWidth)) / 2 = -1.666
                    expect(top).to.be.closeTo(-1.666, 0.1);
                }));
            });
        });
        describe('for landscape images', () => {
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield updateImg(srcImg, 'cover', 'initial', fourByThreeUri);
                srcImg.style.width = `${testWidth}px`;
                srcImg.style.height = `${testHeight}px`;
            }));
            describe('the img', () => {
                let imgElement;
                beforeEach(() => {
                    const { img, scaleElement } = createIntermediateImg(srcImg);
                    imgElement = img;
                    testContainer.appendChild(scaleElement);
                    scaleElement.style.position = 'fixed';
                    scaleElement.style.top = `${testTop}px`;
                    scaleElement.style.left = `${testLeft}px`;
                });
                it('should size correctly', () => __awaiter(this, void 0, void 0, function* () {
                    const { width, height } = imgElement.getBoundingClientRect();
                    // (4/3) * testHeight = 13.333
                    expect(width).to.be.closeTo(13.333, 0.1);
                    // Smaller dimension is height, so should match testHeight
                    expect(height).to.equal(10);
                }));
                it('should position correctly', () => __awaiter(this, void 0, void 0, function* () {
                    const { left, top } = imgElement.getBoundingClientRect();
                    // Should center the horizontal and has a width of 13.333
                    // testLeft + (testHeight - ((4/3) * testHeight)) / 2 = -1.666
                    expect(left).to.be.closeTo(-1.666, 0.1);
                    // Height matches testHeight, so centered at testTop
                    expect(top).to.equal(0);
                }));
            });
        });
    });
    describe('object-position', () => {
        function setupImg(position) {
            return __awaiter(this, void 0, void 0, function* () {
                yield updateImg(srcImg, 'contain', position, threeByFourUri);
                srcImg.style.width = `${testWidth}px`;
                srcImg.style.height = `${testHeight}px`;
                const { img, scaleElement } = createIntermediateImg(srcImg);
                testContainer.appendChild(scaleElement);
                scaleElement.style.position = 'fixed';
                scaleElement.style.top = `${testTop}px`;
                scaleElement.style.left = `${testLeft}px`;
                return img;
            });
        }
        it('should size correctly for pixel offsets for top/left', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('top 2px left 1px');
            const { width, height } = imgElement.getBoundingClientRect();
            // (3/4) * testHeight
            expect(width).to.equal(7.5);
            // Larger dimension is height, so should match testHeight
            expect(height).to.equal(10);
        }));
        it('should size correctly for pixel offsets for bottom/right', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('bottom 2px right 1px');
            const { width, height } = imgElement.getBoundingClientRect();
            // (3/4) * testHeight
            expect(width).to.equal(7.5);
            // Larger dimension is height, so should match testHeight
            expect(height).to.equal(10);
        }));
        it('should size correctly for percentage offsets for top/left', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('top 10% left 20%');
            const { width, height } = imgElement.getBoundingClientRect();
            // (3/4) * testHeight
            expect(width).to.equal(7.5);
            // Larger dimension is height, so should match testHeight
            expect(height).to.equal(10);
        }));
        it('should size correctly for percentage offsets for bottom/right', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('bottom 10% right 20%');
            const { width, height } = imgElement.getBoundingClientRect();
            // (3/4) * testHeight
            expect(width).to.equal(7.5);
            // Larger dimension is height, so should match testHeight
            expect(height).to.equal(10);
        }));
        it('should position correctly for pixel offsets for top/left', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('top 2px left 1px');
            const { left, top } = imgElement.getBoundingClientRect();
            // Should left align, offset by 1px
            expect(left).to.equal(1);
            // Should align to the top, offset by 1px
            expect(top).to.equal(2);
        }));
        it('should position correctly for pixel offsets for bottom/right', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('bottom 2px right 1px');
            const { left, top } = imgElement.getBoundingClientRect();
            // Should right align and has a width of 7.5, offset by 1px from the
            // right edge.
            // testLeft + (testHeight - ((3/4) * testHeight)) - 1 = 3.5
            expect(left).to.equal(1.5);
            // Should align to the bottom, has a height of 10px, offset by 2px from
            // the bottom edge.
            expect(top).to.equal(-2);
        }));
        it('should position correctly for percentage offsets for top/left', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('top 10% left 20%');
            const { left, top } = imgElement.getBoundingClientRect();
            // Should left align, but 20% into the child's width of 7.5 (1.5px)
            // should be at 20% into the parent's width of 10 (2px).
            expect(left).to.equal(0.5);
            // Should align to the top, but 10% into the y axis of the child's
            // height (1px) should be at 10% into the parent's height (1px).
            expect(top).to.equal(0);
        }));
        it('should position correctly for percentage offsets for bottom/right', () => __awaiter(this, void 0, void 0, function* () {
            const imgElement = yield setupImg('bottom 10% right 20%');
            const { left, top } = imgElement.getBoundingClientRect();
            // Should right align, but 80% into the child's width of 7.5 (6px)
            // should be at 80% into the parent's width of 10 (8px).
            expect(left).to.equal(2);
            // Should align to the bottom, but 90% into the y axis of the child's
            // height (9px) should be at 90% into the parent's height (9px).
            expect(top).to.equal(0);
        }));
    });
});
//# sourceMappingURL=test-intermediate-img.js.map