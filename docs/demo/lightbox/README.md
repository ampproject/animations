Uses `prepareImageAnimation` to do a lightbox transition for images. Since the
animation is a CSS based animation, you can have it run in sync with other CSS
based animations (in this case a fade in/out of the lightbox background).

The animation here has one slight workaround: it uses a fixed position container
when the body does not have a `scrollHeight` > `window.innerHeight` (e.g. not
currently scrolling). This is to prevent the animation causing overflow (and
thus scrollbars showing up), which can can be a big problem on desktops (if  the
scrollbar is not overlaid on top of the content).
