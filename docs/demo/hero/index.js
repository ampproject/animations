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

const duration = 600;
const curve = {x1: 0.8, y1: 0, x2: 0.2, y2: 1};
const styles = {
  animationDuration: `${duration}ms`,
};

window.toggle = function(event, targetId) {
  const current = event.currentTarget.closest('.page');
  const target = document.getElementById(targetId);
  const srcImg = current.querySelector('.hero');
  const targetImg = target.querySelector('.hero');
  // We do the transition within the target page. This will make sure that if
  // the user scrolls during the animation, that the image still animates to
  // the correct location. Note that this element has `position: relative`
  // so that the animation can position correctly.
  const transitionContainer = target.querySelector('.content-container');

  target.hidden = false;

  const {
    applyAnimation,
    cleanupAnimation,
  } = prepareImageAnimation({
    transitionContainer,
    srcImg,
    targetImg,
    styles,
    curve,
  });

  target.setAttribute('transition', '');
  current.hidden = true;
  applyAnimation();

  setTimeout(() => {
    target.removeAttribute('transition');
    cleanupAnimation();
  }, duration + 100);
}
