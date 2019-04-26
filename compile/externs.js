/**
 * @typedef {{
 *   x1: number,
 *   y1: number,
 *   x2: number,
 *   y2: number,
 * }}
 */
let Curve;

/**
 * @param {{
 *   transitionContainer: HTMLElement,
 *   styleContainer: HTMLElement,
 *   srcImg: HTMLImageElement,
 *   targetImg: HTMLImageElement,
 *   srcImgRect: ClientRect,
 *   srcCropRect: ClientRect,
 *   targetImgRect: ClientRect,
 *   targetCropRect: ClientRect,
 *   curve: Curve,
 *   styles: Object,
 *   keyframesNamespace: string,
 * }} options
 * @return {{
 *   applyAnimation: function(),
 *   cleanupAnimation: function(),
 * }}
 */
window.prepareImageAnimation = function(options) {}

