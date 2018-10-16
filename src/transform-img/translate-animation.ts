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

export function prepareTranslateAnimation({
  element,
  largerRect,
  smallerRect,
  curve,
  styles,
  keyframesPrefix,
  toLarger,
} : {
  element: HTMLElement,
  largerRect: ClientRect,
  smallerRect: ClientRect,
  curve: Curve,
  styles: Object,
  keyframesPrefix: string,
  toLarger: boolean,
}): string {
  const keyframesName = `${keyframesPrefix}-translation`;

  const startRect = toLarger ? smallerRect : largerRect;
  const endRect = toLarger ? largerRect : smallerRect;
  // We need to calculate the left/top, but account for the fact the
  // container will be a different size due to scaling.
  const deltaWidth = (endRect.width - startRect.width);
  const deltaHeight = (endRect.height - startRect.height)
  const startLeft = startRect.left - (toLarger ? deltaWidth / 2 : 0);
  const startTop = startRect.top - (toLarger ? deltaHeight / 2 : 0);
  const endLeft = endRect.left + (toLarger ? 0 : deltaWidth / 2);
  const endTop = endRect.top + (toLarger ? 0 : deltaHeight / 2);
  // How much we need to move the container to match the target.
  const deltaLeft = startLeft - endLeft;
  const deltaTop = startTop - endTop;

  Object.assign(element.style, styles, {
    position: 'fixed',
    top: `${endTop}px`,
    left: `${endLeft}px`,
    willChange: 'transform',
    animationName: keyframesName,
    animationTimingFunction: curveToString(curve),
    animationFillMode: 'forwards',
  });

  return `
    @keyframes ${keyframesName} {
      from {
        transform: translate(${deltaLeft}px, ${deltaTop}px);
      }

      to {
        transform: translate(0, 0);
      }
  `;
}
