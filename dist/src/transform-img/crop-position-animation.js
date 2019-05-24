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
import { curveToString } from '../bezier-curve-utils.js';
/**
 * Prepares an animation for position (i.e. for object-position). This function
 * sets up the animation by setting the appropriate style properties on the
 * desired Element. The returned style text needs to be inserted for the
 * animation to run.
 * @param options
 * @param options.element The element to apply the position to.
 * @param options.largerRect
 *    rects.
 * @param options.largerCropRect
 * @param options.smallerRect
 * @param options.smallerCropRect
 * @param options.curve The timing curve for the scaling.
 * @param options.style The styles to apply to `element`.
 * @param options.keyframesPrefix A prefix to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 * @param options.toLarger Whether or not `largerRect` / `largerCropRect` are
 *    the positions are we are animating to.
 * @return CSS style text to perform the animation.
 */
export function prepareCropPositionAnimation({ element, largerRect, largerCropRect, smallerRect, smallerCropRect, curve, styles, keyframesPrefix, toLarger, }) {
    const curveString = curveToString(curve);
    const keyframesName = `${keyframesPrefix}-crop-position`;
    const largerTranslate = {
        top: largerRect.top - largerCropRect.top,
        left: largerRect.left - largerCropRect.left,
    };
    const smallerTranslate = {
        top: smallerRect.top - smallerCropRect.top,
        left: smallerRect.left - smallerCropRect.left,
    };
    const startTranslate = toLarger ? smallerTranslate : largerTranslate;
    const endTranslate = toLarger ? largerTranslate : smallerTranslate;
    Object.assign(element.style, styles, {
        'willChange': 'transform',
        'animationName': keyframesName,
        'animationTimingFunction': curveString,
        'animationFillMode': 'forwards',
    });
    return `
    @keyframes ${keyframesName} {
      from {
        transform: translate(${startTranslate.left}px, ${startTranslate.top}px);
      }

      to {
        transform: translate(${endTranslate.left}px, ${endTranslate.top}px);
      }
    }
  `;
}
//# sourceMappingURL=crop-position-animation.js.map