import { Size } from './size.js';
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
export declare function getPositioningTranslate(objectPosition: string, containerRect: Size, contentDimensions: Size): {
    top: number;
    left: number;
};
