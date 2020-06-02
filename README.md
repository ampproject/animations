# Animations

Some JavaScript animation helpers.

## Links

* [Documentation](https://ampproject.github.io/animations/)

## Image Transform

Transforms an image from one position/size to another. In addition to scaling
up, this also supports changing the 'crop' of the image as defined by the
`object-fit` CSS property.

## Animation Test Helpers

Helps with writing tests for animations by pausing then and allowing control of
the progress of animations on the page. You can pause an animation part way
through and do a screenshot based test or simply validate the position or
dimensions of elements.

## Developing

### Build

```shell
yarn build
yarn build-watch
```

### Test

```shell
yarn test
yarn test-watch
```

### Demos

To build, serve, and open a browser tab with the demos:

```shell
yarn demo
```
