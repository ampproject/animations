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

import {prepareImageAnimation} from '../../../dist/animations.mjs';

const srcImg = document.querySelector('.panorama-start');
const targetImg = document.querySelector('.panorama-end');
const duration = 4000;
const curve = {x1: 0.42, y1: 0, x2: 0.58, y2: 1};
const styles = {
  animationDuration: `${duration}ms`,
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
};

const {
  applyAnimation,
} = prepareImageAnimation({
  srcImg,
  targetImg,
  styles,
  curve,
});

// Hide the original images, since we will always just play the animation back
// and forth. Not really necessary since we are stacked on top of them.
srcImg.hidden = true;
targetImg.hidden = true;

// Since we are just leaving this to bounce back and forth, we never call
// cleanup.
applyAnimation();
