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

import {Curve, getBezierCurveValue} from '../bezier-curve-utils.js';

interface Scale {
  x: number,
  y: number,
}

/**
 * Number of samples to use when generating the keyframes. The amount of error
 * for scale * counter scale when interpolating by the number of samples:
 *
 * 10: ~1.8%
 * 20: ~0.4%
 * 30: ~0.2%
 *
 * We want to keep the number of samples low with an acceptable
 * (non-perceivable) amount of error.
 */
const numSamples = 20;

/**
 * Interpolates a value x% between a and b.
 */
function interpolate(a: number, b: number, x: number): number {
  return a + x * (b - a);
}

/**
 * Generates a CSS stylesheet for animating between two images.
 */
function generateCropKeyframes({
  startScale,
  endScale,
  curve,
  scaleKeyframesName,
  counterScaleKeyframesName,
} : {
  startScale: Scale,
  endScale: Scale,
  curve: Curve,
  scaleKeyframesName: string,
  counterScaleKeyframesName: string,
}): string {
  let scaleElementKeyframes = '';
  let counterScaleKeyframes = '';

  /*
   * Generates keyframes for the browser to interpolate from. We simply need to
   * make sure there are enough for this to be smooth. Note: we are generating
   * keyframes as a function of `t` in the Bezier curve formula and not time.
   * The keyframes generated will be more clustered when the output (y) value
   * is more rapidly changing, so we should not have too much error no matter
   * which two keyframes the browser interpolates between.
   */ 
  for (let i = 0; i <= numSamples; i++) {
    const t = i * (1 / numSamples);
    // The progress through the animation at this point.
    const px = getBezierCurveValue(curve.x1, curve.x2, t);
    // The output percentage at this point.
    const py = getBezierCurveValue(curve.y1, curve.y2, t);
    const keyframePercentage = px * 100;
    const scaleX = interpolate(startScale.x, endScale.x, py);
    const scaleY = interpolate(startScale.y, endScale.y, py);
    const counterScaleX = 1 / scaleX;
    const counterScaleY = 1 / scaleY;

    scaleElementKeyframes += `${keyframePercentage}% {
      transform: scale(${scaleX}, ${scaleY});
    }`;

    counterScaleKeyframes += `${keyframePercentage}% {
      transform: scale(${counterScaleX}, ${counterScaleY});
    }`;
  }

  return `
    @keyframes ${scaleKeyframesName} {
      ${scaleElementKeyframes}
    }

    @keyframes ${counterScaleKeyframesName} {
      ${counterScaleKeyframes}
    }
  `;
}

/**
 * Prepares a crop animation. This is done by scaling up the croping container
 * while scaling down a nested container to preserve the scale of the inner
 * content. This function sets up the animation by setting the appropriate
 * style properties on the desired Elements. The returned style text needs
 * to be inserted for the animation to run.
 * @return CSS style text to perform the aniamtion.
 */
export function prepareCropAnimation({
  scaleElement,
  counterScaleElement,
  largerRect,
  smallerRect,
  curve,
  styles,
  keyframesPrefix,
  toLarger,
} : {
  scaleElement: HTMLElement,
  counterScaleElement: HTMLElement,
  largerRect: ClientRect,
  smallerRect: ClientRect,
  curve: Curve,
  styles: Object,
  keyframesPrefix: string,
  toLarger: boolean,
}): string {
  const scaleKeyframesName = `${keyframesPrefix}-crop`;
  const counterScaleKeyframesName = `${keyframesPrefix}-counterScale`;

  // We scale up the scaleElement to clip the img properly.
  const scaleDown = {
    x: smallerRect.width/ largerRect.width,
    y: smallerRect.height / largerRect.height,
  };
  const neutralScale = {x: 1, y: 1};
  const startScale = toLarger ? scaleDown : neutralScale;
  const endScale = toLarger ? neutralScale : scaleDown;

  Object.assign(scaleElement.style, styles, {
    willChange: 'transform',
    animationName: scaleKeyframesName,
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  });

  Object.assign(counterScaleElement.style, styles, {
    willChange: 'transform',
    animationName: counterScaleKeyframesName,
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  });

  return generateCropKeyframes({
    startScale,
    endScale,
    curve,
    scaleKeyframesName,
    counterScaleKeyframesName,
  });
}
