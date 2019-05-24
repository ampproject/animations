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
import { getRenderedDimensions } from './img-dimensions.js';
import { getPositioningTranslate } from './object-position.js';
/**
 * Creates a replacement for a given img, which should render the same as the
 * source img, but implemented with a cropping container and and img using
 * `object-fit: fill`. This can be used to implement a transition of the image.
 * The crop can be transitioned by scaling up the container while scaling down
 * the image by the inverse amount.
 * @param srcImg The source img.
 * @param srcImgRect The rect for `srcImg`. Can be provided if already
 *    measured.
 * @param imageDimensions The dimensions for the rendered image. Can be
 *    provided if already measured.
 * @return The replacement container along with structural information.
 */
export function createIntermediateImg(srcImg, srcImgRect = srcImg.getBoundingClientRect(), srcCropRect = srcImgRect, imagePosition = getComputedStyle(srcImg).getPropertyValue('object-position'), imageDimensions = getRenderedDimensions(srcImg, srcImgRect)) {
    const positioningTranslate = getPositioningTranslate(imagePosition, srcImgRect, imageDimensions);
    const translateElement = document.createElement('div');
    const scaleElement = document.createElement('div');
    const counterScaleElement = document.createElement('div');
    const cropPositionContainer = document.createElement('div');
    const imgContainer = document.createElement('div');
    const img = srcImg.cloneNode(true);
    img.className = '';
    img.style.cssText = '';
    imgContainer.appendChild(img);
    cropPositionContainer.appendChild(imgContainer);
    counterScaleElement.appendChild(cropPositionContainer);
    scaleElement.appendChild(counterScaleElement);
    translateElement.appendChild(scaleElement);
    Object.assign(scaleElement.style, {
        'overflow': 'hidden',
        'width': `${srcCropRect.width}px`,
        'height': `${srcCropRect.height}px`,
    });
    Object.assign(imgContainer.style, {
        'transform': `translate(${positioningTranslate.left}px, ${positioningTranslate.top}px)`,
    });
    Object.assign(img.style, {
        'display': 'block',
        'width': `${imageDimensions.width}px`,
        'height': `${imageDimensions.height}px`,
    });
    return {
        translateElement,
        scaleElement,
        counterScaleElement,
        cropPositionContainer,
        imgContainer,
        img,
    };
}
//# sourceMappingURL=intermediate-img.js.map