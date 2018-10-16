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
import {getRenderedDimensions} from '../img-dimensions.js';
import {createReplacement} from '../replacement-img.js';
import {prepareCropAnimation} from './crop-animation.js';
import {prepareScaleAnimation} from './scale-animation.js';
import {prepareTranslateAnimation} from './translate-animation.js';

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
 * Prepares an animation from one image to another. Creates a a temporary
 * replacement image that is transitioned between the two images.
 * @param options
 * @param options.transitionContainer The container to place the transition
 *    image in. Defaults to document.body.
 * @param options.styleContainer The container to place the generated
 *    stylesheet in. Defaults to document.head.
 * @param options.srcImg The image to transition from.
 * @param options.targetImg The image to transition to.
 * @param options.srcImgRect The ClientRect for where the transition should
 *    start from. Defaults to the current rect for srcImg.
 * @param options.targetImgRect The ClientRect for where the transition should
 *    end at. Defaults to the current rect for targetImg.
 * @param options.curve Control points for a Bezier curve to use for the
 *    animation.
 * @param options.styles Styles to apply to the transitioning Elements. This
 *    should include animationDuration. It might also include animationDelay.
 * @param options.translateCurve Control points for a Bezier curve to use for
 *    the translation portion of animation. Defaults to `curve`.
 * @param options.translateStyles Styles to apply to the translating Elements.
 *    This should include animationDuration. It might also include
 *    animationDelay. Defaults to `styles`.
 * @param options.scaleCurve Control points for a Bezier curve to use for
 *    the translation portion of animation. Defaults to `curve`.
 * @param options.scaleStyles Styles to apply to the scaling Elements. This
 *    should include animationDuration. It might also include animationDelay.
 *    Defaults to `styles`.
 * @param options.keyframesNamespace A namespace to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 */
export function prepareImageAnimation({
  transitionContainer = document.body,
  styleContainer = document.head!,
  srcImg,
  targetImg,
  srcImgRect = srcImg.getBoundingClientRect(),
  targetImgRect = targetImg.getBoundingClientRect(),
  curve,
  styles,
  translateCurve = curve,
  translateStyles = styles,
  scaleCurve = curve,
  scaleStyles = styles,
  keyframesNamespace = 'img-transform',
} : {
  transitionContainer: HTMLElement,
  styleContainer: HTMLElement,
  srcImg: HTMLImageElement,
  targetImg: HTMLImageElement,
  srcImgRect?: ClientRect,
  targetImgRect?: ClientRect,
  curve: Curve,
  styles: Object,
  translateCurve?: Curve,
  translateStyles?: Object,
  scaleCurve?: Curve,
  scaleStyles?: Object,
  keyframesNamespace?: string,
}) : {
  applyAnimation: () => void,
  cleanupAnimation: () => void,
} {
  const targetSize = targetImgRect.width * targetImgRect.height;
  const srcSize = srcImgRect.width * srcImgRect.height;
  const useTarget = targetSize > srcSize;
  const largerImg = useTarget ? targetImg : srcImg;
  const largerRect = useTarget ? targetImgRect : srcImgRect;
  const smallerImg = useTarget ? srcImg : targetImg;
  const smallerRect = useTarget ? srcImgRect : targetImgRect;
  const keyframesPrefix = getKeyframesPrefix(keyframesNamespace);
  const toLarger = largerImg == targetImg;

  const {
    translateElement,
    scaleElement,
    counterScaleElement,
    img,
    imgWidth: largerImgWidth,
    imgHeight: largerImgHeight,
  } = createReplacement(largerImg, largerRect);
  const {
    width: smallerImgWidth,
    height: smallerImgHeight,
  } = getRenderedDimensions(smallerImg, smallerRect);

  const cropStyleText = prepareCropAnimation({
    scaleElement,
    counterScaleElement,
    largerRect,
    smallerRect,
    curve,
    styles,
    keyframesPrefix,
    toLarger,
  });
  const translateStyleText = prepareTranslateAnimation({
    element: translateElement,
    largerRect,
    smallerRect,
    curve: translateCurve,
    styles: translateStyles,
    keyframesPrefix,
    toLarger,
  });
  const scaleStyleText = prepareScaleAnimation({
    element: img,
    largerImgWidth,
    largerImgHeight,
    smallerImgWidth,
    smallerImgHeight,
    curve: scaleCurve,
    styles: scaleStyles,
    keyframesPrefix,
    toLarger,
  });

  const styleTag = document.createElement('style');
  styleTag.textContent = cropStyleText + scaleStyleText + translateStyleText;

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
