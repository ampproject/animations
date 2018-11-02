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

const lightbox = document.getElementById('lightbox');
const lightboxImgContainer = document.getElementById('lightboxImgContainer');
const lightboxBackground = document.getElementById('lightboxBackground');
const lightboxTransitionContainer = document.getElementById('lightboxTransitionContainer');

const duration = 400;
const curve = {x1: 0.8, y1: 0, x2: 0.2, y2: 1};
const styles = {
  animationDuration: `${duration}ms`,
  zIndex: 1,
};

/**
 * Gets the container to do the transition in. This is either the body
 * or a fixed position container, depending on if the body has overflow
 * or not.
 *
 * This is needed as doing the transition with position absolute can cause
 * overflow, causing the scrollbars to show up during the animation.
 * Depending on the OS, this can cause layout as the scrollbar shows/hides.
 *
 * Normally, we want to do the transition in the body, so that if the user
 * scrolls while the transition is in progress (while the lightbox is)
 * closing, the transition ends up in the right place.
 *
 * Note: you will want to prevent scrolling when the lightbox is opening
 * to prevent scrolling during the animation. This will make sure the
 * animation ends in the right place (and that the user does not scroll the
 * body when they do not intend to).
 */
function getTransitionContainer(show) {
  if (document.body.scrollHeight <= window.innerHeight) {
    return lightboxTransitionContainer;
  }

  return document.body;
}

function updateLightbox(srcImg) {
  const lightboxImg = document.createElement('img');
  lightboxImg.className = 'lightbox-img';
  lightboxImg.src = srcImg.src;
  lightboxImg._originalImg = srcImg;

  lightboxImgContainer.innerHTML = '';
  lightboxImgContainer.appendChild(lightboxImg);

  return lightboxImg;
}

function transitionLightbox(srcImg, targetImg, show) {
  lightbox.hidden = false;
  lightboxTransitionContainer.hidden = false;

  const {
    applyAnimation,
    cleanupAnimation,
  } = prepareImageAnimation({
    transitionContainer: getTransitionContainer(),
    srcImg,
    targetImg,
    styles,
    curve,
  });

  srcImg.setAttribute('lightbox-transition', '');
  targetImg.setAttribute('lightbox-transition', '');
  lightboxBackground.setAttribute('lightbox-fade', show ? 'in' : 'out');
  lightboxBackground.style.animationDuration = `${duration}ms`;
  applyAnimation();
  
  setTimeout(() => {
    lightbox.hidden = !show;
    lightboxTransitionContainer.hidden = true;
    srcImg.removeAttribute('lightbox-transition');
    targetImg.removeAttribute('lightbox-transition');
    lightboxBackground.removeAttribute('lightbox-fade');
    cleanupAnimation();
  }, duration + 100);
}

window.showLightbox = function(event) {
  const srcImg = event.currentTarget;
  const targetImg = updateLightbox(srcImg);

  transitionLightbox(srcImg, targetImg, true);
}

window.hideLightbox = function(event) {
  const srcImg = lightboxImgContainer.querySelector('img');
  const targetImg = srcImg._originalImg;

  transitionLightbox(srcImg, targetImg, false);
}
