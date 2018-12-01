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
import { getRenderedDimensions } from './img-dimensions.js';
import { imgLoadPromise } from './testing/utils.js';
const { expect } = chai;
const fourByThreeUri = 'data:image/gif;base64,R0lGODdhBAADAIAAAP///////ywAAAAABAADAAACA4SPVgA7';
const threeByFourUri = 'data:image/gif;base64,R0lGODdhAwAEAIAAAP///////ywAAAAAAwAEAAACA4SPVgA7';
function updateImg(img, fit, src) {
    return __awaiter(this, void 0, void 0, function* () {
        img.style.objectFit = fit;
        img.src = src;
        yield imgLoadPromise(img);
    });
}
function dimensions(width, height) {
    return {
        width,
        height,
    };
}
describe('getDimensions', () => {
    let img;
    beforeEach(() => {
        img = document.createElement('img');
        document.body.appendChild(img);
    });
    afterEach(() => {
        document.body.removeChild(img);
    });
    describe('object-fit: none', () => {
        it('should return the correct dimensions when the natural size is smaller', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'none', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(10, 10));
            expect(width).to.equal(3);
            expect(height).to.equal(4);
        }));
        it('should return the correct dimensions when natural size is larger', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'none', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(3);
            expect(height).to.equal(4);
        }));
    });
    describe('object-fit: fill', () => {
        it('should return the requested dimensions', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'fill', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(10, 10));
            expect(width).to.equal(10);
            expect(height).to.equal(10);
        }));
    });
    describe('unsupported object-fit', () => {
        it('should return the requested dimensions for blank', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'fill', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(10, 10), '');
            expect(width).to.equal(10);
            expect(height).to.equal(10);
        }));
        it('should return the requested dimensions for null', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'fill', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(10, 10), null);
            expect(width).to.equal(10);
            expect(height).to.equal(10);
        }));
    });
    describe('object-fit: contain', () => {
        it('should return the correct dimensions when constrained by width', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'contain', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(3 / 2);
            expect(height).to.equal(2);
        }));
        it('should return the correct dimensions when constrained by height', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'contain', fourByThreeUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(2);
            expect(height).to.equal(3 / 2);
        }));
        it('should return the correct dimensions not constrained', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'contain', fourByThreeUri);
            const { width, height } = getRenderedDimensions(img, dimensions(4, 3));
            expect(width).to.equal(4);
            expect(height).to.equal(3);
        }));
    });
    describe('object-fit: cover', () => {
        it('should return the correct dimensions when constrained by width', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'cover', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(2);
            expect(height).to.equal(8 / 3);
        }));
        it('should return the correct dimensions when constrained by height', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'cover', fourByThreeUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(8 / 3);
            expect(height).to.equal(2);
        }));
        it('should return the correct dimensions not constrained', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'cover', fourByThreeUri);
            const { width, height } = getRenderedDimensions(img, dimensions(4, 3));
            expect(width).to.equal(4);
            expect(height).to.equal(3);
        }));
    });
    describe('object-fit: scale-down', () => {
        it('should return the correct dimensions requested size is larger', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'scale-down', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(10, 10));
            expect(width).to.equal(3);
            expect(height).to.equal(4);
        }));
        it('should return the correct dimensions when constrained by width', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'scale-down', threeByFourUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(3 / 2);
            expect(height).to.equal(2);
        }));
        it('should return the correct dimensions when constrained by height', () => __awaiter(this, void 0, void 0, function* () {
            yield updateImg(img, 'scale-down', fourByThreeUri);
            const { width, height } = getRenderedDimensions(img, dimensions(2, 2));
            expect(width).to.equal(2);
            expect(height).to.equal(3 / 2);
        }));
    });
});
//# sourceMappingURL=test-img-dimensions.js.map