# Animation Test Controller

## Overview

Helper test functions for controlling the state of CSS-based animations during tests. This allows you to move animations to a particular point in time so that you can verify the animations are working correctly.

## Usage

```javascript
import {
  setup as setupAnimations,
  tearDown as tearDownAnimations,
  offset,
} from '@ampproject/animations/dist/src/testing/animation-test-controller.js';
…

describe('Some animation', () => {
  before(() => {
    setupAnimations();
  });

  after(() => {
    tearDownAnimations();
  });

  it('should render recorrectly 50ms in', () => {
    const animatingElement = …;
    doSomethingStartingAnAnimation();

    offset(50);
    const {top} = animatingElement.getBoundingClientRect();
    expect(top).to.be.closeTo(100, 0.1);

    offset(100); // Note, sets to t=100, not 150
    …
  });
});
```

The `offset` function takes an optional second argument that restricts the animation offsetting to just a single DOM subtree. This is useful if your test page has multiple animations, but you only really want to test a single one. For example:

```javascript
it('should render the the interesting subtree correctly', () => {
  const interestingSubtree = document.querySelector('.interesting');
  offset(50, interestingSubtree);
  …
});
```

## How it works

The setup call will pause all animations on the page by setting their `animation-play-state` to `paused`. This applies to both existing animations and those that are defined in the future. Once setup, the `offset` function moves all animations within a subtree to a specific time by specifying a negative `animation-duration`. This works correctly, even if you have already specified an `animation-delay` on an Element. The offset specified takes into account any existing animation delay, so it will work correctly if some of your animations already have delays.
