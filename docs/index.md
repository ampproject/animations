## `prepareImageAnimation`

Prepares an animation for an image from one size, location and crop to another. This is done by creating a temporary `<img>` element that is animated between the source and the target. Once the animation is completed, the temporary `<img>` is removed. The animation is done using `position: absolute`, to allow the image to move as the user scrolls.

In order to animate the crop, the function looks at how the source and target images are rendered using the size and [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) property. It then animates between the two states, which may cause the cropping to change as the animation proceeds. See the [hero animation demo](./demo/hero) for an example of this in action.

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
#### `transitionContainer`

This option defaults to `document.body` and is where the the animating `<img>` is placed. Two cases where you might not want this to be the body are:

1. The body is not the scrolling container.
2. The body is the scrolling container, but is not currently scrolling.

When the body is not the scrolling container, you will want to place the animating `<img>` somewhere in the scrolling container. As an exmaple, the [hero animation demo](./demo/hero) places the transition image on the newly active page. The structure looks like:

```html
<div class="page" style="position: absolute; overflow-y: auto">
  <div class="content-container" style="position: relative;">
    … content
  </div>
</div>
```
  
The demo uses `.content-container` as `transitionContainer`. Since the `transitionContainer` moves as the user scrolls, the animation moves in sync.

#### `styleContainer`

This defaults to `document.head` and is where generated CSS for the animation is placed. If you want the animation to be placed within [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) (i.e. specifying a `transitionContainer` within a `ShadowRoot`), then you will want the `ShadowRoot` to be the `styleContainer`.

#### `srcImg`

An `<img>` to animate from. This is used to determine the position, size, and the `object-fit` property to start the animation with.


#### `targetImg`

An `<img>` to animate to. This is used to determine the position, size, and the `object-fit` property to end the animation with.

#### `srcImgRect`

Defaults to `srcImg.getBoundingClientRect()`. If the `srcImg` is not laid out at the time you call `prepareImageAnimation`, you will want to capture the `ClientRect` beforehand and provide it to the call.

One situtation this might be useful is if you are doing an animation between pages, where the content is in the `body` itself rather than in a separate scrolling container. For example. consider the following page structure:

```html
<body>
  <div class="page">
    …
  </div>
  <div class="page" hidden>
    <h1>Some title that might wrap depending on the viewport width</h1>
    <img class="hero" …>
  </div>
</body>
```

To figure out where the `hero` will be positioned, we need to layout the target page (e.g. by adding `hidden` to the current page and removing it from the target page). However, hiding the current page will mean `prepareImageAnimation` will no longer know where to start the animation. By providing `srcImgRect`, the animation can know where to start from.

#### `targetImgRect`

Defaults to `targetImg.getBoundingClientRect()`. If you know where the `targetImg` will be rendered, but you have not laid out the containing content, you can provide it to `prepareImageAnimation`. You can use this to avoid a forced layout in some situations, for example in the [hero animation demo](./demo/hero), we do something like:

```javascript
// Layout the the target so that we know where targetImg is
target.hidden = false;

// Forced style calc + layout when we go to measure things
const {
  applyAnimation,
  cleanupAnimation,
} = prepareImageAnimation(…);

// Regular style calc + layout for mutations
current.hidden = true;
applyAnimation();
```

The forced style calculation caused by `prepareImageAnimation` can be avoided if you already know where `targetImg` will be positioned. Note that in this case, you will still need to provide a `targetImg` to the function so that the animation knows the `object-fit` property to animate to.
