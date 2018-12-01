import {Size} from './size.js';

/**
 * @param str A string to extract a number from.
 * @param units The units for the number to extract.
 * @return A number for the first encountered with a suffix or zero if
 *    none is found.
 */
function extractNumber(str: string, units: string): number {
  // Some various possible formats to extract from:
  // `10px`, `20%`, `calc(-5px - 30%)`, `calc(5px + 30%)`
  // Make sure to allow for spaces before the minus sign.
  const regExp = new RegExp('-?\\s*\\d+' + units);
  // Get the match, or default to 0.
  const numberWithSign = (str.match(regExp) || ['0'])[0];
  // Remove any spaces between a minus sign and the number.
  const numberString = numberWithSign.replace(' ', '');
  // Parse the number, which will ignore the trailing units.
  return Number.parseFloat(numberString);
}

/**
 * @param str A string to extract a percentage value from.
 * @return A number for the first encountered pixel value found.
 */
function extractPx(str: string): number {
  return extractNumber(str, 'px');
}

/**
 * @param str A string to extract a percentage value from.
 * @return A number for the first encountered percentage value found.
 */
function extractPercentage(str: string): number {
  return extractNumber(str, '%');
}

/**
 * Gets the translate needed to position content for an image matching
 * `object-position: ...`. This is based on the size of the container as well
 * as the size of the content.
 * @param objectPosition A computed `object-position` property value.
 * @param containerRect The rect for the image container.
 * @param contentDimensions The dimensions for the rendered image content.
 * @return The amount needed to translate by to match the desired
 *    `object-position`.
 * @see https://drafts.csswg.org/css-backgrounds-3/#valdef-background-position-percentage
 */
export function getPositioningTranslate(
    objectPosition: string,
    containerRect: Size,
    contentDimensions: Size
): {
    top: number,
    left: number,
} {
  // For IE, which does not support `object-position`, default the behavior to
  // center.
  const positionStr = objectPosition || '50% 50%';

  const splitIndex = positionStr.startsWith('calc') ?
      positionStr.indexOf(')') + 1 : positionStr.indexOf(' ');
  const xPos = positionStr.slice(0, splitIndex) || '';
  const yPos = positionStr.slice(splitIndex) || '';
  const xPx = extractPx(xPos);
  const yPx = extractPx(yPos);
  const xPercentage = extractPercentage(xPos) / 100;
  const yPercentage = extractPercentage(yPos) / 100;

  return {
    top: yPercentage * (containerRect.height - contentDimensions.height) + yPx,
    left: xPercentage * (containerRect.width - contentDimensions.width) + xPx,
  };
}
