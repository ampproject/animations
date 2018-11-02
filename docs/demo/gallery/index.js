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

import {prepareImageAnimation} from '../../../dist/index.js';

const duration = 350;
const curve = {x1: 0, y1: 0, x2: 0.2, y2: 1};
const styles = {
  animationDuration: `${duration}ms`,
  // Make sure the transition image appears on top of other things with
  // a z-index. Could also put the transition in a container that has a
  // z-index.
  zIndex: 1,
};
const gallery = document.querySelector('.gallery');
const targetImg = document.querySelector('.large');
const targetImgSizes = targetImg.sizes;

/**
 * Loads an img using a srcset, with a larger `size` value. This does not
 * actually set the `size` attribute on the img.
 */
function loadLargerImgSrc(img, largerSize) {
  if (img._preloaded) {
    return;
  }

  const dummyImg = new Image();
  dummyImg.srcset = img.srcset;
  dummyImg.sizes = largerSize;

  img._preloaded = true;
}

/**
 * Preloads the larger size of the img. Should be called from
 * mousedown and touchstart.
 */
window.preloadImg = function(event) {
  const img = event.target.closest('img');

  if (!img) {
    return;
  }

  loadLargerImgSrc(img, targetImgSizes);
};

window.expand = function(event) {
  const srcImg = event.target.closest('img');

  if (!srcImg || srcImg.hasAttribute('selected')) {
    return;
  }

  if(gallery.hasAttribute('transition')) {
    return;
  }

  // Use the same src as the smaller img during the transition. We want to
  // do the transition without needing to download the larger src first.
  // If possible, use the currentSrc as the src during the transition. If
  // not, use the same srcset/sizes as `srcImg`. The `currentSrc` works
  // around a Chrome behavior where an inflight preload of a higher resolution
  // src will be preferred over an already downloaded src that matches
  // the `sizes` attribute.
  if (srcImg.currentSrc) {
    targetImg.src = srcImg.currentSrc;
    targetImg.srcset = '';
    targetImg.sizes = '';
  } else {
    targetImg.src = '';
    targetImg.srcset = srcImg.srcset;
    targetImg.sizes = srcImg.sizes;
  }

  const {
    applyAnimation,
    cleanupAnimation,
  } = prepareImageAnimation({
    srcImg,
    targetImg,
    styles,
    curve,
  });

  // Make sure to start loading the larger src now, if we have not already.
  loadLargerImgSrc(srcImg, targetImgSizes);

  gallery.setAttribute('transition', '');
  gallery.querySelector('[selected]').removeAttribute('selected');
  srcImg.setAttribute('selected', true);
  applyAnimation();

  setTimeout(() => {
    gallery.removeAttribute('transition');
    // Change over sizes (and srcset if not already) so that the browser
    // will switch to the higher resolution src once it becomes available.
    targetImg.srcset = srcImg.srcset;
    targetImg.sizes = targetImgSizes;
    cleanupAnimation();
  }, duration + 100);
}
