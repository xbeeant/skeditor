import { localStorageRef } from '../composables/localstorage';

const InitWidth = 300;
const MinWidth = 250;
const MaxWidth = 500;

export const outlineLeftWidth = localStorageRef('OutlineLeftWidth', InitWidth);
export const outlineRightWidth = localStorageRef('OutlineRightWidth', InitWidth);

export function setupLeftOutline() {
  const width = outlineLeftWidth;
  let _dragStartWidth = 0;

  function onDragStart() {
    _dragStartWidth = width.value;
  }

  function onOffset(offset: number) {
    width.value = Math.min(Math.max(_dragStartWidth - offset, MinWidth), MaxWidth);
  }

  return {
    width,
    onDragStart,
    onOffset,
  };
}

export function setupRightOutline() {
  const width = outlineRightWidth;
  let _dragStartWidth = 0;

  function onDragStart() {
    _dragStartWidth = width.value;
  }

  function onOffset(offset: number) {
    width.value = Math.min(Math.max(_dragStartWidth + offset, MinWidth), MaxWidth);
  }

  return {
    width,
    onDragStart,
    onOffset,
  };
}
