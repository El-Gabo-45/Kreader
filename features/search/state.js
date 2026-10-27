export const state = {
  matches: [],
  currentIndex: -1,
  overlays: [],
  container: document.body,
}

export let getCurrentPageFn = () => 1

export function setCurrentPageGetter(fn) {
  if (typeof fn === "function") getCurrentPageFn = fn
}

export function setOverlayContainer(el) {
  if (el instanceof HTMLElement) state.container = el
}