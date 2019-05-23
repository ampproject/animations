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

const dropArea = document.querySelector('.drop');
const imgContainer = document.querySelector('.src-img-container');
const origImg = document.querySelector('.src-img-container img');

function onDragEnter(e) {
  dropArea.setAttribute('drag-over', '');

  window.addEventListener('dragend', function onDragEnd(e) {
    window.removeEventListener('dragend');
    dropArea.removeAttribute('drag-over');
  });

  e.stopPropagation();
  e.preventDefault();
}

function onDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

function onDragLeave(e) {
  if (e.target == dropArea || !dropArea.contains(e.target)) {
    dropArea.removeAttribute('drag-over');
  }


  e.stopPropagation();
  e.preventDefault();
}

/**
 * Handles a drop event, which could potentially be an image URL (dragged from
 * a website) or a File (dragged from a Desktop).
 * @param {!Event} e 
 */
function onDrop(e) {
  dropArea.removeAttribute('drag-over');

  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const url = dt.getData('URL');
  if (url) {
    updateSrc(url);
  } else if (dt.files) {
    [...dt.files]
      .filter(f => f.type.startsWith('image/'))
      .filter((f, i) => i == 0)
      .forEach(f => {
        readImg(f);
      });
  }

  return false;
}

/**
 * Updates the src of the image form selection.
 * @param {string} src The src to use.
 */
function updateSrc(src) {
  origImg.src = src;
  window.dispatchEvent(new CustomEvent('img-change'));
}

/**
 * Reads a file, then sets the src of the image using the contents as a data-url.
 * @param {!File} file The file to read.
 */
function readImg(file) {
  const reader = new FileReader();
  reader.onload = function(){
    const dataUrl = reader.result;
    updateSrc(dataUrl);
  };
  reader.readAsDataURL(file);
}

dropArea.addEventListener('dragenter', onDragEnter, true);
dropArea.addEventListener('dragover', onDragOver, true);
dropArea.addEventListener('dragleave', onDragLeave, true);
dropArea.addEventListener('drop', onDrop, true);
