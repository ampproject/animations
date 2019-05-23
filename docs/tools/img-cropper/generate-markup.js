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

/**
 * @param {{
 *   originalRect: !DOMRect,
 *   croppedRect: !DOMRect,
 *   imgSrc: string,
 *   outputWidth: number,
 * }} config
 * @return {{
 *   amp: {css: string, html: string},
 *   html: {css: string, html: string},
 *   styles: {paddingBottom: string, transform: string},
 * }}
 */
export function generateMarkup({originalRect, croppedRect, imgSrc, outputWidth}) {
  const {
    top,
    left,
    width,
    height,
  } = croppedRect;

  const widthRatio = originalRect.width / width;
  const heightRatio = originalRect.height / height;
  const aspectRatio = 100 * (height / width);

  const yDelta = top / originalRect.height;
  const yTranslate = 100 * yDelta;
  const xDelta = left / originalRect.width;
  const xTranslate = 100 * xDelta;

  const paddingBottom = `${aspectRatio.toFixed(4)}%`;
  const scale = `scale(${widthRatio.toFixed(4)}, ${heightRatio.toFixed(4)})`;
  const translate = `translate(-${xTranslate.toFixed(4)}%, -${yTranslate.toFixed(4)}%)`;
  const transform = `${scale} ${translate}`;

  return {
    amp: generateAmpMarkup(width, height, transform, imgSrc, outputWidth),
    html: generateHtmlMarkup(paddingBottom, transform, imgSrc, outputWidth),
    styles: {
      paddingBottom,
      transform,
    },
  };
}

/**
 * @param {number} width The responsive width for the amp-img.
 * @param {number} height The responsive height for the amp-img.
 * @param {string} transform The transform to apply to the img.
 * @param {string} imgSrc The src for the img.
 * @param {number} outputWidth The width for the rendered image.
 */
function generateAmpMarkup(width, height, transform, imgSrc, outputWidth) {
  const css = `
amp-img img {
  transform: var(--img-transform);
  transform-origin: top left;
}`.slice(1);

  const html = `
<amp-img layout="responsive" width="${width}" height="${height}"
  src="${imgSrc}"
  style="width: ${outputWidth}; --img-transform: ${transform}">
</amp-img>`.slice(1);

  return {
    css,
    html,
  };
}

/**

 * @param {string} paddingBottom The padding bottom for a responsive sizer.
 * @param {string} transform The transform to apply to the img.
 * @param {string} imgSrc The src for the img.
 * @param {number} outputWidth The width for the rendered image.
 */
function generateHtmlMarkup(paddingBottom, transform, imgSrc, outputWidth) {
  const css = `
.crop {
  position: relative;
  overflow: hidden;
}

.crop > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: top left;
}`.slice(1);

  const html = `
<div class="crop" style="width: ${outputWidth}">
  <div style="padding-bottom: ${paddingBottom}"></div>
  <img src="${imgSrc}" style="transform: ${transform}">
</div>`.slice(1);

  return {
    css,
    html,
  };
}
