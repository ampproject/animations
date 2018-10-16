# Transform Img

## Overview

This directory contains logic for transforming an image from one location to
another. The animation is comprised of 3 parts:

* Scaling up the image in the x and y directions to the final scale
* Translating the image in the x and y directions to the final location
* Changing the crop in the x and y directions to the final crop

Each of these are implemented in seprate file.

## Implementation

In order to have the animation perform well, including on older devices, only
CPU accelrated animatable properties. As a result, the 'crop' portion of the
animation is implemented by scaling up a cropping container (with 
`overflow: hidden`) and counteracting the scaling with an inverse scale on a
child container.

The animations are implemented by taking the larger size and animating using
that as a reference point for scaling. That is, when the transition is where
the larger image is (whether that is the starting state or ending state), the
scale values will all be `1.0`. This is done to avoid rounding errors from
the various scale animations from having a user perceivable impact. The errors
are much less or not at all noticable for the smaller image. When we are going
from a small image to a large image (say scaling by 5x), we will animate the
scale from `0.2` to `1.0`. If we were to run the reverse operation, we would
scale from `1.0` to `0.2`.