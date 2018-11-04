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
export declare function offset(offset: number, root?: ParentNode | undefined): void;
/**
 * Initializes, stopping all animations and allowing them to be offset.
 */
export declare function setup(): void;
/**
 * Tears down, resuming all animations.
 */
export declare function tearDown(): void;
