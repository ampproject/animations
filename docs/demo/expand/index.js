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
const curve = {x1: 0.42, y1: 0, x2: 0.58, y2: 1};
const styles = {
  animationDuration: `${duration}ms`,
};

window.toggle = function(event) {
  const container = event.currentTarget;
  const expanded = container._expanded;

  const smallImg = container.querySelector('.small');
  const largeImg = container.querySelector('.large');
  const text = container.querySelector('.text');
  const srcImg = expanded ? largeImg : smallImg;
  const targetImg = expanded ? smallImg : largeImg;
  const {
    height: startHeight,
    width: startWidth,
  } = srcImg.getBoundingClientRect();
  const {
    height: endHeight,
    width: endWidth,
   } = targetImg.getBoundingClientRect();
  const deltaHeight = endHeight - startHeight;
  const deltaWidth = endWidth - startWidth;
  
  // Move everything after the img container using a translate. This is to make
  // sure the movement performs well (comapred to translating height of the
  // container).
  Array.from(container.parentNode.children)
    .filter(c => {
      return container.compareDocumentPosition(c) === Node.DOCUMENT_POSITION_FOLLOWING;
    }).forEach(c => {
      // Add to any current offset when multiple are expanded.
      const deltaY = (c._deltaY || 0) + deltaHeight;
      c._deltaY = deltaY;

      Object.assign(c.style, {
        'transitionProperty': 'transform',
        'transitionDuration': `${duration}ms`,
        'transitionTimingFunction': 'cubic-bezier(0.42, 0, 0.58, 1)',
        'transform': `translateY(${deltaY}px)`,
      });
    });

  Object.assign(text.style, {
    'transitionProperty': 'transform opacity',
    'transitionDuration': `${duration}ms`,
    'transitionTimingFunction': 'cubic-bezier(0.42, 0, 0.58, 1)',
    'opacity': expanded ? '1' : '0',
    'transform': expanded ? '' : `translateX(${deltaWidth}px)`,
  });

  const {
    applyAnimation,
    cleanupAnimation,
  } = prepareImageAnimation({
    srcImg,
    targetImg,
    styles,
    curve,
  });

  container._expanded = !expanded;
  srcImg.style.visibility = 'hidden';
  applyAnimation();

  // Note: In order to allow resizing / orientation change to work correctly,
  // more work is needed to undo the transations and size things correctly when
  // no more animations are in progress. That is, changing the large image to
  // `position: static` (and the small one to absolute) in the expanded state,
  // then removing the `translateY`s applied.
  setTimeout(() => {
    targetImg.style.visibility = 'visible';
    cleanupAnimation();
  }, duration + 100);
}
