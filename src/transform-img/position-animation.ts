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

import {Curve, curveToString} from '../bezier-curve-utils.js';
import {Size} from '../size.js';
import {getPositioningTranslate} from '../object-position.js';

/**
 * Prepares an animation for position (i.e. for object-position). This function
 * sets up the animation by setting the appropriate style properties on the
 * desired Element. The returned style text needs to be inserted for the
 * animation to run.
 * @param options
 * @param options.element The element to apply the position to.
 * @param options.largerRect The larger of the start/end element container
 *    rects.
 * @param options.largerDimensions The larger of the start/end element
 *    dimensions.
 * @param options.smallerDimensions The smaller of the start/end element
 *    dimensions.
 * @param options.largerObjectPosition The object position for the larger
 *    element.
 * @param options.smallerObjectPosition The object position for the smaller
 *    element.
 * @param options.curve The timing curve for the scaling.
 * @param options.style The styles to apply to `element`.
 * @param options.keyframesPrefix A prefix to use for the generated
 *    keyframes to ensure they do not clash with existing keyframes.
 * @param options.toLarger Whether or not `largerImgDimensions` are the
 *    dimensions are we are animating to.
 * @return CSS style text to perform the animation.
 */
export function preparePositionAnimation({
  element,
  largerRect,
  smallerRect,
  largerDimensions,
  smallerDimensions,
  largerObjectPosition,
  smallerObjectPosition,
  curve,
  styles,
  keyframesPrefix,
  toLarger,
} : {
  element: HTMLElement,
  largerRect: ClientRect,
  smallerRect: ClientRect,
  largerDimensions: Size,
  smallerDimensions: Size,
  largerObjectPosition: string,
  smallerObjectPosition: string,
  curve: Curve,
  styles: Object,
  keyframesPrefix: string,
  toLarger: boolean,
}): string {
  const curveString = curveToString(curve);
  const keyframesName = `${keyframesPrefix}-object-position`;

  const largerTranslate = getPositioningTranslate(
      largerObjectPosition, largerRect, largerDimensions);
  const smallerTranslate = getPositioningTranslate(
      smallerObjectPosition, smallerRect, smallerDimensions);
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
