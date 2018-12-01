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
 * @fileoverview Provides a function to calculate the dimensions of the
 * rendered image  inside of an `<img>` Element. For example, if you have an
 * `<img>` with `object-fit: contain` and an image that is portrait inside of
 * an `<img>` with landscape dimensions, you will have something looks like:
 *  _____________
 * |   |     |   |
 * | i |  r  | i |
 * |___|_____|___|
 * 
 * Where the area denoted by `r` is the rendered image and the areas denoted
 * by `i` are extra spacing on either side of the rendered image to center it
 * within the containing `<img>` Element.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
 */

import {Size} from './size.js';

 /**
  * Constrains the size of the image to the given width and height. This either
  * caps the width or the height depending on the aspect ratio of original img
  * and if we want to have the smaller or larger dimension fit the container.
  * @param naturalSize The natural dimensions of the image.
  * @param containerSize The size of the container we want to render the image
  *     in.
  * @param toMin If we should cap the smaller dimension of the image to fit the
  *     container (`object-fit: cover`) or the larger dimension 
  *     (`object-fit: contain`).
  * @return The Size that the image should be rendered as.
  */
function constrain(
    naturalSize: Size, containerSize: Size, toMin: boolean): Size {
  const elAspectRatio = containerSize.width / containerSize.height;
  const naturalAspectRatio = naturalSize.width / naturalSize.height;

  if (naturalAspectRatio > elAspectRatio !== toMin) {
    return {
      width: containerSize.height * naturalAspectRatio,
      height: containerSize.height,
    };
  }

  return {
    width: containerSize.width,
    height: containerSize.width / naturalAspectRatio,
  };
}

function getDimensionsForObjectFitCover(
    naturalSize: Size, containerSize: Size): Size {
  return constrain(naturalSize, containerSize, false);
}

function getDimensionsForObjectFitContain(
    naturalSize: Size, containerSize: Size): Size {
  return constrain(naturalSize, containerSize, true);
}

function getDimensionsForObjectFitFill(containerSize: Size): Size {
  return containerSize;
}

function getDimensionsForObjectFitNone(naturalSize: Size): Size {
  return naturalSize;
}

function getDimensionsForObjectFitScaleDown(
    naturalSize: Size, containerSize: Size): Size {
  const noneSize = getDimensionsForObjectFitNone(naturalSize);
  const containSize = getDimensionsForObjectFitContain(
      naturalSize, containerSize);

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
 * @param objectFit An optional object-fit value to use. Defaults to the
 *    `img`'s current `object-fit`.
 * @return The width/height of the "actual" image.
 */
export function getRenderedDimensions(
    img: HTMLImageElement,
    containerSize: Size,
    objectFit: string|null = getComputedStyle(img).getPropertyValue('object-fit'),
): Size {
  const naturalSize = {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };

  switch(objectFit) {
    case 'cover':
      return getDimensionsForObjectFitCover(naturalSize, containerSize);
    case 'contain': 
      return getDimensionsForObjectFitContain(naturalSize, containerSize);
    case 'fill':
      return getDimensionsForObjectFitFill(containerSize);
    case 'none':
      return getDimensionsForObjectFitNone(naturalSize);
    case 'scale-down':
      return getDimensionsForObjectFitScaleDown(naturalSize, containerSize);
    case '':
    case null:
      // For browsers that do not support `object-fit`, default to `fill`
      // behavior.
      return getDimensionsForObjectFitFill(containerSize);
    default:
      throw new Error(`object-fit: ${objectFit} not supported`);
  }
}
