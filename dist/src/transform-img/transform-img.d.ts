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
import { Curve } from '../bezier-curve-utils.js';
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
export declare function prepareImageAnimation({ transitionContainer, styleContainer, srcImg, targetImg, srcImgRect, srcCropRect, targetImgRect, targetCropRect, curve, styles, keyframesNamespace, }: {
    transitionContainer: HTMLElement;
    styleContainer: Element | Document | DocumentFragment;
    srcImg: HTMLImageElement;
    targetImg: HTMLImageElement;
    srcImgRect?: ClientRect;
    srcCropRect?: ClientRect;
    targetImgRect?: ClientRect;
    targetCropRect?: ClientRect;
    curve?: Curve;
    styles: Object;
    keyframesNamespace?: string;
}): {
    applyAnimation: () => void;
    cleanupAnimation: () => void;
};
