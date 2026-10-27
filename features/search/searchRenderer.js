import { state }                                              from "./state.js"
import { applyRect, applyCommonOverlayStyles, SPAN_SELECTOR } from "./domHelpers.js"

const UNDERLINE_HEIGHT = 2

export function renderSearchOverlays() {
  clearSearchOverlays()

  for (const [index, match] of state.matches.entries()) {
    const { range, span, layer } = match
    const layerRect = layer.getBoundingClientRect()

    for (const rect of range.getClientRects()) {
      const overlay = createSearchOverlay(rect, layerRect, index === state.currentIndex)
      layer.appendChild(overlay)
      state.overlays.push(overlay)
    }

    if (index === state.currentIndex) {
      span.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }
}

export function clearSearchOverlays() {
  for (const el of state.overlays) el.remove()
  state.overlays.length = 0
}

function createSearchOverlay(rect, layerRect, active) {
  const overlay = document.createElement("div")
  overlay.className = active ? "search-overlay search-overlay--active" : "search-overlay"
  applyRect(overlay, rect, layerRect)
  applyCommonOverlayStyles(overlay, 10)
  return overlay
}

export function createHighlightOverlay(rect, layerRect, color) {
  const overlay = document.createElement("div")
  overlay.className = "search-annotation-overlay"
  applyRect(overlay, rect, layerRect)
  applyCommonOverlayStyles(overlay, 5)
  overlay.style.backgroundColor = color
  return overlay
}

export function createUnderlineOverlay(rect, layerRect, color) {
  const overlay = document.createElement("div")
  overlay.className             = "search-annotation-overlay"
  overlay.style.position        = "absolute"
  overlay.style.left            = `${rect.left - layerRect.left}px`
  overlay.style.top             = `${rect.top - layerRect.top + rect.height - UNDERLINE_HEIGHT}px`
  overlay.style.width           = `${rect.width}px`
  overlay.style.height          = `${UNDERLINE_HEIGHT}px`
  overlay.style.backgroundColor = color
  overlay.style.pointerEvents   = "none"
  overlay.style.zIndex          = "5"
  return overlay
}