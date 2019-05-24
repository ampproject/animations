## Overview

Some standalone JavaScript animation helpers used by [AMP
HTML](https://github.com/ampproject/amphtml).

## Image Transform

Transforms an image from one position/size to another. In addition to scaling
up, this also supports changing the 'crop' of the image as defined by the
`object-fit` CSS property.

[Documentation](docs/prepare-image-animation.md)

Demos:
* [Hero animation](docs/demo/hero)
* [Lightbox](docs/demo/lightbox)
* [Image gallery](docs/demo/gallery)
* [Inline image expansion](docs/demo/expand)
* [Panning an image back and forth](docs/demo/pan)
* [Cropped image animation](docs/demo/zoom-crop)

## Animations Test Controller

Allows pausing / stepping through CSS based animations, which can be useful for
testing animation logic as well as screenshot diff tests.

[Documentation](docs/animation-test-controller.md)
