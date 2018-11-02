A demo of an image gallery with transitions using `prepareImageAnimation`.
A single image is used for the larger state, with the srcset switched out when
the image animation has completed.

The smaller images use a smaller `sizes` attribute, resulting in a lower
resolution image. When you click on one of the smaller images, the larger
version is preloaded while the transition is in process. Once the transition
is complete, the larger `sizes` attribute is applied. As a result, the browser
will update the `<img>` once the larger src is finished downloading.
