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
 * Prepares a crop animation. This is done by scaling up the croping container
 * while scaling down a nested container to preserve the scale of the inner
 * content. This function sets up the animation by setting the appropriate
 * style properties on the desired Elements. The returned style text needs
 * to be inserted for the animation to run.
 * @param options
 * @param options.scaleElement The element to apply the scaling to. This should
 *    have `overflow: hidden`,
 * @param options.counterScaleElement The element to counteract the scaling.
 *    This should be a child of `scaleElement`.
 * @param options.largerRect The larger of the start/end cropping rects.
 * @param options.smallerRect The smaller of the start/end cropping rects.
 * @param options.curve The timing curve for how the crop should expand or
 *    contract.
 * @param options.style The styles to apply to both the `scaleElement` and
 *    `counterScaleElement`.
 * @param options.keyframesPrefix A prefix to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 * @param options.toLarger Whether or not `largerRect` is the rect we are
 *    animating to.
 * @return CSS style text to perform the animation.
 */
export declare function prepareCropAnimation({ scaleElement, counterScaleElement, largerRect, smallerRect, curve, styles, keyframesPrefix, toLarger, }: {
    scaleElement: HTMLElement;
    counterScaleElement: HTMLElement;
    largerRect: ClientRect;
    smallerRect: ClientRect;
    curve: Curve;
    styles: Object;
    keyframesPrefix: string;
    toLarger: boolean;
}): string;
