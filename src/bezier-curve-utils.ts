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

export interface Curve {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

/**
 * A string representation of the curve that can be used as an
 * `animation-timing-function`.
 */
export function curveToString(curve: Curve): string {
  return `cubic-bezier(${curve.x1}, ${curve.y1}, ${curve.x2}, ${curve.y2})`;
}

/**
 * Gets the x/y value for the given control points for a given value of t.
 */
export function getBezierCurveValue(c1: number, c2: number, t: number): number {
  const t_2 = t * t;
  const t_3 = t_2 * t;
  // Formula for 4 point bezier curve with c0 = 0 and c3 = 1.
  return (3 * (t - 2 * t_2 + t_3) * c1) +
         (3 * (t_2 - t_3) * c2) + (t_3);
}

