A demo of an inline expansion of an image using `prepareImageAnimation`. This
demo uses various value for `object-position` to show how you can position the
rendered images and how they look when animated.

Note: The demo's collapse animation has a a few problems if done while the
bottom of the body is visible in the viewport. The animation may be janky in
Chrome. On other browsers, the page scroll position will jump at the end of the
animation. You should ideally leave enough space below the last image such that
you do not encounter this behavior.