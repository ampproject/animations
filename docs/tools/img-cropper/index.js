/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import './dragger.js';
import './dropper.js';
import {generateMarkup} from './generate-markup.js';
import {prepareImageAnimation} from '../../../dist/animations.mjs';

const imgContainer = document.querySelector('.src-img-container');
const origImg = document.querySelector('.target');
const imgCrop = document.querySelector('.crop');
const sizer = document.querySelector('.sizer');
const croppedImg = document.querySelector('.crop img');
let selectedWidth = 96;
let renderedWidth = "96px";
let useSelectedWidth = true;
let coords = {};

/**
 * @return {number} The width to use to size the output image.
 */
function getWidth() {
  if (useSelectedWidth) {
    return `${selectedWidth}px`;
  }

  return renderedWidth;
}

/**
 * Updates the selected portion of the image using the current coordinates.
 */
function updateSelection() {
  selectedWidth = coords.width;

  const outputWidth = getWidth();
  const {
    amp,
    html,
    styles: {
      paddingBottom,
      transform,
    },
  } = generateMarkup({
    originalRect: origImg.getBoundingClientRect(),
    croppedRect: coords,
    imgSrc: '…',
    outputWidth,
  });

  document.querySelector('.amp-markup .css').textContent = amp.css;
  document.querySelector('.amp-markup .html').textContent = amp.html;
  document.querySelector('.html-markup .css').textContent = html.css;
  document.querySelector('.html-markup .html').textContent = html.html;

  // Update the preview image.
  sizer.style.paddingBottom = paddingBottom;
  croppedImg.style.transform = transform;
  imgCrop.style.width = outputWidth;
}

// Handles newly selected coordinates.
window.addEventListener('area-selected', event => {
  croppedImg.src = origImg.src;
  coords = event.detail;
  updateSelection();
});

// Updates the preview image to use the width from the input field.
window.adjustWidth = function(newWidth) {
  renderedWidth = newWidth;
  updateSelection();
};

// Updates the preview image to use the width from the selection.
window.useSelectedWidth = function(value) {
  useSelectedWidth = value;
  updateSelection();
};

// Plays a preview of what the animation looks like.
window.playAnimation = function() {
  const animation = prepareImageAnimation({
    srcImg: croppedImg,
    srcCropRect: imgCrop.getBoundingClientRect(),
    targetImg: origImg,
    styles: {
      animationDuration: '1000ms',
    },
  });

  imgContainer.style.visibility = 'hidden';
  croppedImg.style.visibility = 'hidden';
  animation.applyAnimation();
  requestAnimationFrame(() => {
    setTimeout(() => {
      setTimeout(() => {
        imgContainer.style.visibility = 'visible';
        croppedImg.style.visibility = 'visible';
        animation.cleanupAnimation();
      }, 1000);
    });
  });
};

// Updates which output format is shown in the tool.
window.updateOutputFormat = function(event) {
  const isAmp = event.target.id == 'ampHtml';
  const query = isAmp ? '?output=amp' : '';
  const url = location.origin + location.pathname + query;
  history.replaceState({}, '', url);
}

// Update the output format checkbox based on the initial query string.
const ampOutput = location.search.includes('output=amp');
if (ampOutput) {
  document.querySelector('#ampHtml').checked = true;
}