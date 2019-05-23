const srcImgContainer = document.querySelector('.src-img-container');
const selectionContainer = document.querySelector('.selection-container');
const rect = document.querySelector('.selection-rect');
const targetImg = document.querySelector('.target');
const draggers = [0, 0, 0, 0].map(() => {
  return createDragger(srcImgContainer);
});

let dragger = draggers[2];
let mousedown = false;
let x0 = 0
let y0 = 0;
let x1 = x0 + 96;
let y1 = y0 + 96;
let lastX = 0;
let lastY = 0;

/**
 * @param {number} min 
 * @param {number} value 
 * @param {number} max 
 * @return {number}
 */
function bound(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Gets the Rect for the currently selected coordinates.
 * @return {{
 *   top: number,
 *   bottom: number,
 *   left: number,
 *   right: number,
 *   width: number,
 *   height: number,
 * }}
 */
function getSelectedRect() {
  return {
    top: Math.min(y0, y1),
    bottom: Math.max(y0, y1),
    left: Math.min(x0, x1),
    right: Math.max(x0, x1),
    width: Math.abs(x0 - x1),
    height: Math.abs(y0 - y1),
  };
}

/**
 * Notifies interested parties that a new area was selected.
 */
function notifySelected() {
  window.dispatchEvent(new CustomEvent('area-selected', {
    detail: getSelectedRect(),
  }));
}

/**
 * Handles a mousedown on a dragger, setting it as the current dragger.
 */
function mousedownDragger() {
  mousedown = true;

  dragger = event.target;
  event.stopPropagation();
}

/**
 * Creates a dragger and appends it to the container.
 * @param {!Element} container 
 */
function createDragger(container) {
  const div = document.createElement('div');
  div.className = 'dragger';
  div.onmousedown = mousedownDragger;
  container.appendChild(div);
  return div;
}

/**
 * Updates the UI (the draggers and the highlight rect) for the currently
 * selected coordinates.
 */
function updateSelected() {
  const {
    top,
    left,
    width,
    height,
  } = getSelectedRect();
  draggers[0].style.transform = `translate(${x0}px, ${y0}px)`;
  draggers[1].style.transform = `translate(${x1}px, ${y0}px)`;
  draggers[2].style.transform = `translate(${x1}px, ${y1}px)`;
  draggers[3].style.transform = `translate(${x0}px, ${y1}px)`;
  rect.style.left = `${left}px`;
  rect.style.top = `${top}px`;
  rect.style.width = `${width}px`;
  rect.style.height = `${height}px`;
}

/**
 * Updates the current coordinates based on the last mouse location and whether
 * or not the shift key is pressed. When the shift key is pressed, a 1:1 aspect
 * ration is forced.
 * @param {boolean} shiftKey 
 */
function updateCoordinates(shiftKey) {
  const draggerIndex = draggers.indexOf(dragger);
  const initialRect = targetImg.getBoundingClientRect();
  const startX = draggerIndex == 0 || draggerIndex == 3 ? x1 : x0;
  const startY = draggerIndex == 0 || draggerIndex == 1 ? y1 : y0;
  const x = lastX - initialRect.left;
  const y = lastY - initialRect.top;
  const targetRect = targetImg.getBoundingClientRect();
  const boundX = bound(0, x, targetRect.width);
  const boundY = bound(0, y, targetRect.height);

  let xDelta = startX - boundX;
  let yDelta = startY - boundY;

  // Lock aspect ratio to 1:1.
  if (shiftKey) {
    const smallerSize = Math.min(Math.abs(xDelta), Math.abs(yDelta));
    xDelta = bound(-smallerSize, xDelta, smallerSize);
    yDelta = bound(-smallerSize, yDelta, smallerSize);
  }

  // Based on which dragger is moving, update the correct coordinates.
  switch(draggerIndex) {
    case 0:
      x0 = x1 - xDelta;
      y0 = y1 - yDelta;
      break;
    case 1:
      x1 = x0 - xDelta;
      y0 = y1 - yDelta;
      break;
    case 2:
      x1 = x0 - xDelta;
      y1 = y0 - yDelta;
      break;
    case 3:
      x0 = x1 - xDelta;
      y1 = y0 - yDelta;
      break;
  }

  updateSelected();
  event.preventDefault();
}

function resetSelection() {
  x0 = 0
  y0 = 0;
  x1 = x0 + 96;
  y1 = y0 + 96;

  updateSelected();
  notifySelected();
}

targetImg.addEventListener('load', () => {
  resetSelection();
});

window.addEventListener('mousedown', event => {
  const target = event.target.closest('.target');

  if (!target) {
    return;
  }

  const initialRect = targetImg.getBoundingClientRect();
  const x = event.x - initialRect.left;
  const y = event.y - initialRect.top;

  dragger = draggers[2];
  mousedown = true;
  x0 = x;
  y0 = y;
  x1 = x0;
  y1 = y0;

  updateSelected();
  event.preventDefault();
});

window.addEventListener('mouseup', event => {
  if (!mousedown) {
    return;
  }

  mousedown = false;
  notifySelected();
});


window.addEventListener('keydown', event => {
  if (!mousedown) {
    return;
  }

  updateCoordinates(event.shiftKey);
});

window.addEventListener('keyup', event => {
  if (!mousedown) {
    return;
  }

  updateCoordinates(event.shiftKey);
});

window.addEventListener('mousemove', event => {
  if (!mousedown) {
    return;
  }

  lastX = event.x;
  lastY = event.y;

  updateCoordinates(event.shiftKey);
});

setTimeout(() => {
  resetSelection();
});