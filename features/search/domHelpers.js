import { state } from "./state.js"

export const TEXT_LAYER_SELECTOR = ".textLayer"
export const SPAN_SELECTOR       = "span"

export function getTextLayers() {
  const scrollContainer = document.getElementById("scroll-container")

  if (scrollContainer) {
    return Array.from(scrollContainer.querySelectorAll(TEXT_LAYER_SELECTOR))
  }

  const single = state.container.querySelector(TEXT_LAYER_SELECTOR)
  return single ? [single] : []
}

export function createRange(node, start, end) {
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, end)
  return range
}

export function isTextNode(node) {
  return node?.nodeType === Node.TEXT_NODE
}

export function applyRect(el, rect, layerRect) {
  el.style.position = "absolute"
  el.style.left     = `${rect.left - layerRect.left}px`
  el.style.top      = `${rect.top  - layerRect.top}px`
  el.style.width    = `${rect.width}px`
  el.style.height   = `${rect.height}px`
}

export function applyCommonOverlayStyles(el, zIndex) {
  el.style.pointerEvents = "none"
  el.style.zIndex        = String(zIndex)
  el.style.mixBlendMode  = "multiply"
}