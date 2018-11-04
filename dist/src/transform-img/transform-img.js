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
import { getPositionedContainer } from '../positioned-container.js';
import { getRenderedDimensions } from '../img-dimensions.js';
import { createItermediateImg } from '../intermdediate-img.js';
import { prepareCropAnimation } from './crop-animation.js';
import { prepareScaleAnimation } from './scale-animation.js';
import { prepareTranslateAnimation } from './translate-animation.js';
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/single-transition-timing-function#ease-in-out
 */
const EASE_IN_OUT = { x1: 0.42, y1: 0, x2: 0.58, y2: 1 };
/**
 * A counter that makes sure the keyframes names are unique.
 */
let keyframesPrefixCounter = 0;
/**
 * Gets a prefix name to use for the keyframes, avoiding clashing with other
 * keyframes that may be defined.
 * @param namespace A namespace to use as a prefix.
 * @return The prefix to use for the various keyframes.
 */
function getKeyframesPrefix(namespace) {
    keyframesPrefixCounter += 1;
    return `${namespace}-${keyframesPrefixCounter}-`;
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
export function prepareImageAnimation({ transitionContainer = document.body, styleContainer = document.head, srcImg, targetImg, srcImgRect = srcImg.getBoundingClientRect(), targetImgRect = targetImg.getBoundingClientRect(), curve = EASE_IN_OUT, styles, keyframesNamespace = 'img-transform', }) {
    const targetArea = targetImgRect.width * targetImgRect.height;
    const srcArea = srcImgRect.width * srcImgRect.height;
    const useTarget = targetArea > srcArea;
    const largerImg = useTarget ? targetImg : srcImg;
    const largerRect = useTarget ? targetImgRect : srcImgRect;
    const smallerImg = useTarget ? srcImg : targetImg;
    const smallerRect = useTarget ? srcImgRect : targetImgRect;
    const keyframesPrefix = getKeyframesPrefix(keyframesNamespace);
    const toLarger = largerImg == targetImg;
    const smallerImageDimensions = getRenderedDimensions(smallerImg, smallerRect);
    const largerImageDimensions = getRenderedDimensions(largerImg, largerRect);
    const { translateElement, scaleElement, counterScaleElement, img, } = createItermediateImg(largerImg, largerRect, largerImageDimensions);
    const positionedParent = getPositionedContainer(transitionContainer);
    const positionedParentRect = positionedParent.getBoundingClientRect();
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
        positionedParentRect,
        largerRect,
        smallerRect,
        curve,
        styles,
        keyframesPrefix,
        toLarger,
    });
    const scaleStyleText = prepareScaleAnimation({
        element: img,
        largerDimensions: largerImageDimensions,
        smallerDimensions: smallerImageDimensions,
        curve,
        styles,
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
//# sourceMappingURL=transform-img.js.map