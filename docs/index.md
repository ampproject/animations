## `prepareImageAnimation`

Prepares an animation for an image from one size, location and crop to another. This is done by creating a temporary `<img>` element that is animated between the source and the target. The animation is done using `position: absolute`, to allow the image to move as the user scrolls.

The animation is first prepared, then applied and finally cleaned up. The creation and application are two different steps, which can be useful if you want to avoid [layout thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid_forced_synchronous_layouts) using a library like [fastdom](https://github.com/wilsonpage/fastdom).

Typical usage looks like:

```javascript
const duration = 400;
const {
  applyAnimation,
  cleanupAnimation,
} = prepareImageAnimation({
  srcImg,
  targetImg,
  styles: {
    animationDuration: `${duration}ms`,
  },
});

applyAnimation();
setTimeout(cleanupAnimation, duration);
```

More details about the arguments are contained below.

### Function signature

```javascript
function prepareImageAnimation({
  transitionContainer = document.body,
  styleContainer = document.head!,
  srcImg,
  targetImg,
  srcImgRect = srcImg.getBoundingClientRect(),
  targetImgRect = targetImg.getBoundingClientRect(),
  curve = EASE_IN_OUT,
  styles,
  keyframesNamespace = 'img-transform',
} : {
  transitionContainer: HTMLElement,
  styleContainer: Element|Document|DocumentFragment,
  srcImg: HTMLImageElement,
  targetImg: HTMLImageElement,
  srcImgRect?: ClientRect,
  targetImgRect?: ClientRect,
  curve?: Curve,
  styles: Object,
  keyframesNamespace?: string,
}) : {
  applyAnimation: () => void,
  cleanupAnimation: () => void,
}
```
#### transitionContainer

This option defaults to `document.body` and is where the the animating `<img>` is placed. Two cases where you might not want this to be the body are:

1. The body is not the scrolling container.
2. The body is the scrolling container, but is not currently scrolling.

When the body is not the scrolling container, you will want to place the animating `<img>` somewhere in the scrolling container. As an exmaple, the [hero animation demo](demo/hero) places the transition image on the newly active page. The structure looks like:

```html
<div class="page" style="position: absolute; overflow-y: auto">
  <div class="content-container" style="position: relative;">
    … content
  </div>
</div>
```
  
The demo uses `.content-container` as `transitionContainer`. Since the `transitionContainer` moves as the user scrolls, the animation moves in sync.

#### styleContainer

This defaults to `document.head` and is where generated CSS for the animation is placed. If you want the animation to be placed within [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) (i.e. specifying a `transitionContainer` within a `ShadowRoot`), then you will want the `ShadowRoot` to be the `styleContainer`. 
