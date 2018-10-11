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

/**
 * @fileoverview Provides a function the dimensions of the rendered image
 * inside of an <img> tag.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
 */

 interface Size {
    width: number,
    height: number,
 }

 /**
  * Constrains the size of the image to the given width an height. This either
  * caps the width or the height depending on the aspect ratio of original img
  * and if we want to have the smaller or larger dimension fit the container.
  */
function constrain(
    naturalSize: Size, containerSize: Size, toMin: boolean): Size {
  const {width, height} = containerSize;
  const elAspectRatio = width / height;
  const naturalAspectRatio = naturalSize.width / naturalSize.height;

  if (naturalAspectRatio > elAspectRatio !== toMin) {
    return {
      width: height * naturalAspectRatio,
      height,
    };
  }

  return {
    width,
    height: width / naturalAspectRatio,
  };
}

function getDimensionsForCover(
    naturalSize: Size, containerSize: Size): Size {
  return constrain(naturalSize, containerSize, false);
}

function getDimensionsForContain(
    naturalSize: Size, containerSize: Size): Size {
  return constrain(naturalSize, containerSize, true);
}

function getDimensionsForFill(containerSize: Size): Size {
  return containerSize;
}

function getDimensionsForNone(naturalSize: Size): Size {
  return naturalSize;
}

function getDimensionsForScaleDown(
    naturalSize: Size, containerSize: Size): Size {
  const noneSize = getDimensionsForNone(naturalSize);
  const containSize = getDimensionsForContain(naturalSize, containerSize);

  // Since both have the same aspect ratio, we can simply take the smaller
  // dimension for both.
  return {
    width: Math.min(noneSize.width, containSize.width),
    height: Math.min(noneSize.height, containSize.height),
  };
}

/**
 * Gets the dimensions for the rendered "image" rather than the container
 * that constrains the size with the CSS `object-fit` property.
 * @param img The HTMLImageElement
 * @param containerSize The size of the container element.
 * @return The width/height of the "actual" image.
 */
export function getRenderedDimensions(
    img: HTMLImageElement, containerSize: Size): Size {
  const {objectFit} = getComputedStyle(img);
  const naturalSize = {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };

  switch(objectFit) {
    case 'cover':
      return getDimensionsForCover(naturalSize, containerSize);
    case 'contain': 
      return getDimensionsForContain(naturalSize, containerSize);
    case 'fill':
      return getDimensionsForFill(containerSize);
    case 'none':
      return getDimensionsForNone(naturalSize);
    case 'scale-down':
      return getDimensionsForScaleDown(naturalSize, containerSize);
    default:
      throw new Error(`object-fit: ${objectFit} not supported`);
  }
}
