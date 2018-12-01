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
 * Prepares a translation animation, assuming that `smallerRect` will be scaled
 * up to `largerRect` using `transform-origin: top left`.
 * This function sets up the animation by setting the appropriate style
 * properties on the desired Element. The returned style text needs to be
 * inserted for the animation to run.
 * @param options
 * @param options.element The element to apply the scaling to.
 * @param options.positionedParentRect The rect for the positioned parent.
 *    We need to account for the difference of the target's top/left and where
 *    we will position absolutely to.
 * @param options.largerRect The larger of the start/end scaling rects.
 * @param options.smallerRect The smaller of the start/end scaling rects.
 * @param options.curve The timing curve for the scaling.
 * @param options.style The styles to apply to `element`.
 * @param options.keyframesPrefix A prefix to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 * @param options.toLarger Whether or not `largerRect` is the rect we are
 *    animating to.
 * @return CSS style text to perform the animation.
 */
export declare function prepareTranslateAnimation({ element, positionedParentRect, largerRect, smallerRect, curve, styles, keyframesPrefix, toLarger, }: {
    element: HTMLElement;
    positionedParentRect: ClientRect;
    largerRect: ClientRect;
    smallerRect: ClientRect;
    curve: Curve;
    styles: Object;
    keyframesPrefix: string;
    toLarger: boolean;
}): string;
