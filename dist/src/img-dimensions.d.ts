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
import { Size } from './size.js';
/**
 * Gets the dimensions for the rendered "image" rather than the container
 * that constrains the size with the CSS `object-fit` property.
 * @param img The HTMLImageElement
 * @param containerSize The size of the container element.
 * @param objectFit An optional object-fit value to use. Defaults to the
 *    `img`'s current `object-fit`.
 * @return The width/height of the "actual" image.
 */
export declare function getRenderedDimensions(img: HTMLImageElement, containerSize: Size, objectFit?: string | null): Size;
