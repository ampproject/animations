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
 * @fileoverview Helpers for controlling animations within a test. This
 * supports pausing all CSS-based animations on the page and then controlling
 * them by manually moving the time offset within the animation.
 * 
 * During the test setup, you should call `setup()` and during the test tear
 * down, you should call `tearDown()`. During a test case, you can call
 * `offset(time)` to move all animations to a specific time. Note that this
 * does not move them forward by `time` but rather to `time`.
 * 
 * Note: for animationend events to fire, you will need to wait for the browser
 * to render (e.g. using requestAnimationFrame + setTimeout).
 */

/**
 * Sets all animations in a DOM subtree to a certain time into the animation.
 * This is done by adding CSS rules to target the Elements and their pseudo
 * Elements to apply a negative animation-delay. Note: if you depend on any
 * events that trigger off of an animation ending, you must allow the JavaScript
 * execution loop to end (i.e. by using setTimeout) before they trigger.
 * @param offset The animation offset, in milliseconds.
 * @param root The optional root to set animation offsets for.
 */
export function offset(offset: number, root: ParentNode|undefined = document) {
  const elements = getAllElements(root);

  elements.forEach(resetDelay);
  elements.forEach(el => applyOffsets(el, offset));
}

let active: boolean = false;

/**
 * Initializes, stopping all animations and allowing them to be offset.
 */
export function setup() {
  active = true;

  getAllDocs()
      .filter(doc => !styleMap.get(doc))
      .forEach(attachStyleElement);
}

/**
 * Tears down, resuming all animations.
 */
export function tearDown() {
  active = false;

  const allDocs = getAllDocs();

  allDocs
      .map(doc => styleMap.get(doc))
      .filter(style => style!.parentNode)
      .forEach(style => {
        style!.parentNode!.removeChild(style!);
      });
  allDocs.forEach(doc => styleMap.delete(doc));
}

/**
 * Gets all the Documents or ShadowRoots present.
 */
function getAllDocs(): Array<Document|ShadowRoot> {
  const allShadowRoots = getAllElements(document)
      .map(getShadowRoot)
      .filter(sr => sr);

  return (<Array<Document|ShadowRoot>>allShadowRoots).concat(document);
}

/**
 * Capture all ShadowRoots as they are created and attach a style stopper
 * to them if we are active.
 */
function captureShadowRoots() {
  after(Element.prototype, 'createShadowRoot', attachStyleElement);
  after(Element.prototype, 'attachShadow', attachStyleElement);
}

/**
 * Used to get ShadowRoots for Elements, even those created in closed mode.
 */
const shadowRootMap: WeakMap<Element, ShadowRoot> = new WeakMap();

/**
 * Keeps track of the <style> element associated with the given Document or
 * ShadowRoot.
 */
const styleMap: WeakMap<Node, Element> = new WeakMap();

/**
 * Keeps track of which CSS rules have already been added to a style element.
 */
const existingRulesMap: WeakMap<Element, Object>  = new WeakMap();

/**
 * The element selectors. Note: although IE does not support ::backdrop, this
 * does not cause any problems.
 */
const elementSelectors = ['', '::after', '::before', '::backdrop'];

/**
 * The intial style text, creates rules to stop animations on all elements and
 * their pseudo elements.
 */
const styleText = elementSelectors
    .map(sel => `*${sel} { animation-play-state: paused !important; }\n`)
    .join('');

/**
 * Creates a style tag that pauses all animations in the page. Note: for IE
 * this must be re-created each time, using cloneNode(true) will not work.
 * @return An HTMLStyleElement that stops all animations on all Elements.
 */
const createStopperStyle = function(): HTMLStyleElement {
  const stopperStyle = document.createElement('style');
  stopperStyle.appendChild(document.createTextNode(styleText));
  return stopperStyle;
}

/**
 * After function calls to obj[prop], calls the callback with the return value.
 * @param obj
 * @param prop
 * @param callback
 */
function after(obj: Object, prop: string, callback: Function) {
  if (!(prop in obj)) {
    return;
  } 

  const old = obj[prop];
  obj[prop] = function() {
    const retn = old.apply(this, arguments);
    callback(retn);
    return retn;
  }
}

/**
 * Gets the root of a DOM element, which is either the Document or ShadowRoot
 * that contains it, if the element is attached. Otherwise, the element itself
 * is returned.
 * @param el The element to get the root for.
 * @return The root.
 */
function getRoot(el: Node): Node {
  return !el.parentNode ? el : getRoot(el.parentNode);
}

/**
 * Attaches a style for the root of a document that is used to stop and offset
 * animations.
 * @param root The root to attach the style Element to.
 */
function attachStyleElement(root: Document|ShadowRoot) {
  if ('host' in root) {
    shadowRootMap.set(root.host, root);
  }

  if (!active) {
    return;
  }

  const style = createStopperStyle();

  if (root == document) {
    root.head!.appendChild(style);
  } else {
    root.appendChild(style);
  }

  styleMap.set(root, style);
  existingRulesMap.set(style, {});
}

/**
 * @param el The Element to check for a ShadowRoot.
 * @return The ShadowRoot, if present.
 */
function getShadowRoot(el: Element): ShadowRoot|undefined {
  return shadowRootMap.get(el);
}

/**
 * Gets all the elements within the root, including those in shadow DOM.
 * @param root
 * @return All the Elements within the root, including those in ShadowRoots.
 */
function getAllElements(root: ParentNode): Array<Element> {
  const elements = Array.from(root.querySelectorAll('*'));

  return elements
      .map(getShadowRoot)
      .filter(s => s)
      .map(s => getAllElements(s!))
      .reduce((p, c) => p.concat(c), elements);
}

/**
 * Given a pseudo element selector, returns a string to refer to a rule
 * matching the pseudo element. The string is safe for use as an attribute name.
 * @param pseudoElt The pseudo element selector.
 * @return he attribute name to use for the element.
 */
function getAttrName(pseudoElt: string): string {
  return 'offset-animation-delay' + pseudoElt.replace('::', '-');
}

/**
 * Resets an Element's animation delay property back to its initial value.
 * @param el
 */
function resetDelay(el: Element) {
  elementSelectors.map(getAttrName)
      .forEach((attrName) => el.removeAttribute(attrName));
}

/**
 * @param el The element to get the delay string for.
 * @param pseudoElt The pseudo element selector.
 * @param offset The animation offset, in milliseconds.
 * @return The animation delay string for the given offset.
 */
function getDelayString(
    el: Element, pseudoElt: string, offset: number): string {
  return getComputedStyle(el, pseudoElt)!['animationDelay']!
      .split(',')
      .map(part => parseFloat(part) * 1000)
      .map(delay => `${delay - offset}ms`)
      .join(', ');
}

/**
 * Applies the animation delay for a given offset. Adds an attribute and
 * matching CSS rule to target the Element (or one of the Element's pseudo
 * elements).
 *
 * @param el The element to set the animation offset for.
 * @param offset The animation offset, in milliseconds.
 * @param style The style element associated with el.
 * @param pseudoElt The pseudo element selector.
 */
function applyDelay(
    el: Element, offset: number, style: Element, pseudoElt: string) {
  const delay = getDelayString(el, pseudoElt, offset);
  const attrName = getAttrName(pseudoElt);
  const selector = `[${attrName}="${delay}"]${pseudoElt}`;
  const existingRules = existingRulesMap.get(style)!;

  if (!existingRules[selector]) {
    existingRules[selector] = true;
    style.textContent +=
        `${selector} { animation-delay: ${delay} !important }\n`;
  }

  el.setAttribute(attrName, delay);
}

/**
 * Sets the offset of the animation for an Element and any psuedo elements,
 * taking into account any animation delays specified via CSS.
 *
 * @param el The element to set the animation offset for.
 * @param offset The animation offset, in milliseconds.
 */
function applyOffsets(el: Element, offset: number) {
  const documentRoot = getRoot(el);
  const stylesheet = styleMap.get(documentRoot)!;

  elementSelectors.forEach((pseudoElt) => {
    applyDelay(el, offset, stylesheet, pseudoElt);
  });
}

// Always capture ShadowRoots so that we get them even if they were already
// created.
captureShadowRoots();
