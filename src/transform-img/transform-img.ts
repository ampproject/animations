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

import {Curve} from '../bezier-curve-utils.js';
import {Size} from '../size.js';
import {createIntermediateImg} from '../intermediate-img.js';
import {getPositionedContainer} from '../positioned-container.js';
import {getRenderedDimensions} from '../img-dimensions.js';
import {prepareCropAnimation} from './crop-animation.js';
import {prepareCropPositionAnimation} from './crop-position-animation.js';
import {prepareScaleAnimation} from './scale-animation.js';
import {preparePositionAnimation} from './position-animation.js';
import {prepareTranslateAnimation} from './translate-animation.js';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/single-transition-timing-function#ease-in-out
 */
const EASE_IN_OUT = {x1: 0.42, y1: 0, x2: 0.58, y2: 1};

/**
 * A counter that makes sure the keyframes names are unique.
 */
let keyframesPrefixCounter: number = 0;

/**
 * Gets a prefix name to use for the keyframes, avoiding clashing with other
 * keyframes that may be defined.
 * @param namespace A namespace to use as a prefix.
 * @return The prefix to use for the various keyframes.
 */
function getKeyframesPrefix(namespace: string): string {
  keyframesPrefixCounter += 1;

  return `${namespace}-${keyframesPrefixCounter}-`;
}

/**
 * @param img An img to geth the properties for.
 * @param rect The ClientRect of the img.
 */
function getImgProperties(
  img: HTMLImageElement,
  rect: ClientRect,
  cropRect: ClientRect
): {
  objectFit: string,
  objectPosition: string,
  rect: ClientRect,
  cropRect: ClientRect,
  img: HTMLImageElement,
  dimensions: Size,
  area: number,
} {
  const style = getComputedStyle(img);
  const objectFit = style.getPropertyValue('object-fit');
  const objectPosition = style.getPropertyValue('object-position');
  return {
    objectFit, 
    objectPosition,
    rect,
    cropRect,
    img,
    dimensions: getRenderedDimensions(img, rect, objectFit),
    area: rect.width * rect.height,
  };
}

/**
 * Prepares an animation from one image to another. Creates a temporary
 * transition image that is transitioned between the position, size and crop of
 * two images.
 * @param options
 * @param options.transitionContainer The container to place the transition
 *    image in. This could be useful if you need to place the transition in a
 *    container with a specific `z-index` to appear on top of other elements in
 *    the page. It can also be useful if you want to have the transition stay
 *    within the `ShadowRoot` of a component. Defaults to document.body.
 * @param options.styleContainer The container to place the generated
 *    stylesheet in. Defaults to document.head.
 * @param options.srcImg The image to transition from.
 * @param options.targetImg The image to transition to.
 * @param options.srcImgRect The ClientRect for where the transition should
 *    start from. Specifying this could be useful if you need to hide
 *    (`display: none`) the container for `srcImg` in order to layout a page
 *    containing `targetImg`. In that case, you can capture the rect for
 *    `srcImg` up front and then pass it. Defaults to the current rect for
 *    srcImg.
 * @param options.targetImgRect The ClientRect for where the transition should
 *    end at. Specifying this could be useful if you have not had a chance to
 *    perform the layout for the target yet (e.g. in a `display: none`
 *    container), but you know where on the screen it will go. Defaults to the
 *    current rect for targetImg.
 * @param options.curve Control points for a Bezier curve to use for the
 *    animation.
 * @param options.styles Styles to apply to the transitioning Elements. This
 *    should include animationDuration. It might also include animationDelay.
 * @param options.keyframesNamespace A namespace to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 */
export function prepareImageAnimation({
  transitionContainer = document.body,
  styleContainer = document.head!,
  srcImg,
  targetImg,
  srcImgRect = srcImg.getBoundingClientRect(),
  srcCropRect = srcImgRect,
  targetImgRect = targetImg.getBoundingClientRect(),
  targetCropRect = targetImgRect,
  curve = EASE_IN_OUT,
  styles,
  keyframesNamespace = 'img-transform',
} : {
  transitionContainer: HTMLElement,
  styleContainer: Element|Document|DocumentFragment,
  srcImg: HTMLImageElement,
  targetImg: HTMLImageElement,
  srcImgRect?: ClientRect,
  srcCropRect?: ClientRect,
  targetImgRect?: ClientRect,
  targetCropRect?: ClientRect,
  curve?: Curve,
  styles: Object,
  keyframesNamespace?: string,
}) : {
  applyAnimation: () => void,
  cleanupAnimation: () => void,
} {
  const srcProperties = getImgProperties(srcImg, srcImgRect, srcCropRect);
  const targetProperties = getImgProperties(
      targetImg, targetImgRect, targetCropRect);
  const toLarger = targetProperties.area > srcProperties.area;
  const smallerProperties = toLarger ? srcProperties : targetProperties;
  const largerProperties = toLarger ? targetProperties :  srcProperties;
  const keyframesPrefix = getKeyframesPrefix(keyframesNamespace);

  const {
    translateElement,
    scaleElement,
    counterScaleElement,
    cropPositionContainer,
    imgContainer,
    img,
  } = createIntermediateImg(
    largerProperties.img,
    largerProperties.rect,
    largerProperties.cropRect,
    largerProperties.objectPosition,
    largerProperties.dimensions
  );
  const positionedParent = getPositionedContainer(transitionContainer);
  const positionedParentRect = positionedParent.getBoundingClientRect();

  const cropStyleText = prepareCropAnimation({
    scaleElement,
    counterScaleElement,
    largerRect: largerProperties.cropRect,
    smallerRect: smallerProperties.cropRect,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });
  const translateStyleText = prepareTranslateAnimation({
    element: translateElement,
    positionedParentRect,
    largerRect: largerProperties.cropRect,
    smallerRect: smallerProperties.cropRect,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });
  const positionStyleText = preparePositionAnimation({
    element: imgContainer,
    largerRect: largerProperties.rect,
    smallerRect: smallerProperties.rect,
    largerDimensions: largerProperties.dimensions,
    smallerDimensions: smallerProperties.dimensions,
    largerObjectPosition: largerProperties.objectPosition,
    smallerObjectPosition: smallerProperties.objectPosition,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });
  const cropPositionStyleText = prepareCropPositionAnimation({
    element: cropPositionContainer,
    largerRect: largerProperties.rect,
    largerCropRect: largerProperties.cropRect,
    smallerRect: smallerProperties.rect,
    smallerCropRect: smallerProperties.cropRect,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });
  const scaleStyleText = prepareScaleAnimation({
    element: img,
    largerDimensions: largerProperties.dimensions,
    smallerDimensions: smallerProperties.dimensions,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });

  const styleTag = document.createElement('style');
  styleTag.textContent = cropStyleText + translateStyleText +
      positionStyleText + cropPositionStyleText + scaleStyleText;

  function applyAnimation() {
    styleContainer.appendChild(styleTag);
    transitionContainer.appendChild(translateElement);
  }

  function cleanupAnimation() {
    transitionContainer.removeChild(translateElement);
    styleContainer.removeChild(styleTag);
  }

  return {
    applyAnimation,
    cleanupAnimation,
  };
}
