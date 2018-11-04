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
 * Finds the positioned container (i.e. one that has a computed position that
 * is not static). If the element itself is positioned, then we return it,
 * otherwise, we find the first positioned parent. If there are no positioned
 * elements, this will return the root element.
 * @param element The element to get the positioned container for.
 * @return The positioned container.
 */
export function getPositionedContainer(element) {
    const { position } = getComputedStyle(element);
    // Element is positioned, we are done.
    if (position != 'static') {
        return element;
    }
    // We can skip to the offsetParent if present, no need to check all elements
    // in between. If we have an offsetParent, we still need to check that it is
    // positioned, as it will return `document.body`, even if it is not
    // positioned.
    const parent = element.offsetParent || element.parentElement;
    return parent ? getPositionedContainer(parent) : element;
}
//# sourceMappingURL=positioned-container.js.map