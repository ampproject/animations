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

import {
  setup as setupAnimations,
  tearDown as tearDownAnimations,
  offset,
} from './animation-test-controller';

const {expect} = chai;

describe('Animation test controller', () => {
  let container;

  before(() => {
    const style = document.createElement('style');
    style.textContent = `
      .animate {
        animation: 1000ms foo infinite;
      }

      .delayed {
        animation-delay: 125ms;
      }

      .animate-before::before {
        animation: 1000ms foo infinite;
      }

      .delayed-before::before {
        animation-delay: 125ms;
      }

      @keyframes {
        from: {
          opacity: 0;
        }

        to: {
          opacity: 1;
        }
      }
    `;

    document.head!.appendChild(style);
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);    
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('document', () => {
    it('should stop animations on existing Elements', () => {
      const el = document.createElement('div');
      el.className = 'animate';

      container.appendChild(el);
      setupAnimations();

      expect(getComputedStyle(el).animationPlayState).to.equal('paused');
    });

    it('should stop animations on newly added Elements', () => {
      const el = document.createElement('div');
      el.className = 'animate';

      setupAnimations();
      container.appendChild(el);

      expect(getComputedStyle(el).animationPlayState).to.equal('paused');
    });

    it('should stop animations on psuedo elements', () => {
      const el = document.createElement('div');
      el.className = 'animate-before';

      setupAnimations();
      container.appendChild(el);

      expect(getComputedStyle(el, ':before').animationPlayState).to.equal('paused');
    });

    it('should resume animations', () => {
      const el = document.createElement('div');
      el.className = 'animate';

      container.appendChild(el);
      setupAnimations();
      tearDownAnimations();

      expect(getComputedStyle(el).animationPlayState).to.equal('running');
    });

    it('should offset an animation', () => {
      const el = document.createElement('div');
      el.className = 'animate';

      container.appendChild(el);
      setupAnimations();

      offset(100);
      expect(getComputedStyle(el).animationDelay).to.equal('-0.1s');
    });

    it('should offset a delayed animation', () => {
      const el = document.createElement('div');
      el.className = 'animate delayed';

      container.appendChild(el);
      setupAnimations();

      offset(100);
      expect(getComputedStyle(el).animationDelay).to.equal('0.025s');
    });

    it('should offset a delayed animation on a psuedo element', () => {
      const el = document.createElement('div');
      el.className = 'animate-before delayed-before';

      container.appendChild(el);
      setupAnimations();

      offset(100);
      expect(getComputedStyle(el, ':before').animationDelay).to.equal('0.025s');
    });

    it('should offset multiple times', () => {
      const el = document.createElement('div');
      el.className = 'animate-before delayed-before';

      container.appendChild(el);
      setupAnimations();

      offset(100);
      offset(300);
      expect(getComputedStyle(el).animationDelay).to.equal('-0.3s');
    });
  });

  describe('ShadowRoots', () => {
    if (!('attachShadow' in Element.prototype)) {
      return;
    }

    it('should stop animations on existing Elements', () => {
      const outer = document.createElement('div');
      const sr = outer.attachShadow({ mode: 'closed' });
      const el = document.createElement('div');
      el.className = 'animate';

      sr.appendChild(el);
      container.appendChild(outer);
      setupAnimations();

      expect(getComputedStyle(el).animationPlayState).to.equal('paused');
    });

    it('should stop animations on newly added Elements', () => {
      const outer = document.createElement('div');
      const sr = outer.attachShadow({ mode: 'closed' });
      const el = document.createElement('div');
      el.className = 'animate';

      setupAnimations();
      sr.appendChild(el);
      container.appendChild(outer);

      expect(getComputedStyle(el).animationPlayState).to.equal('paused');
    });

    it('should resume animations', () => {
      const outer = document.createElement('div');
      const sr = outer.attachShadow({ mode: 'closed' });
      const el = document.createElement('div');
      el.className = 'animate';

      sr.appendChild(el);
      container.appendChild(outer);
      setupAnimations();
      tearDownAnimations();

      expect(getComputedStyle(el).animationPlayState).to.equal('running');
    });
  });
});
