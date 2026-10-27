const TEXT_SPAN_SELECTOR  = ".textLayer span"
const TEXT_LAYER_SELECTOR = ".textLayer"

import { annotations }           from "./state.js"
import { renderAnnotations }     from "./renderer.js"
import { viewerState, getColor } from "../../shared/state/viewerState.js"
import { isScrollMode }          from "../../shared/state/scrollModeState.js"

export function initSelection({ viewer, getCurrentPage, getCurrentRotation }) {
  document.addEventListener("mouseup", () => {
    if (!viewerState.tool) return

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return

    const range     = selection.getRangeAt(0)
    const textLayer = resolveTextLayer(range, viewer)
    if (!textLayer) return

    const page      = getPageFromTextLayer(textLayer, getCurrentPage)
    const tool      = viewerState.tool
    const color     = getColor()
    const thickness = viewerState.thickness?.[tool] ?? 10
    const rotation  = getCurrentRotation ? getCurrentRotation() : 0
    const spans     = Array.from(textLayer.querySelectorAll(TEXT_SPAN_SELECTOR))

    spans.forEach((span, index) => {
      const offsets = getSpanOffsets(range, span)
      if (!offsets) return
      annotations.push({
        source: "selection",
        tool, color, thickness, page, rotation,
        spanIndex: index,
        ...offsets
      })
    })

    renderAnnotations(viewer, page)
    selection.removeAllRanges()
  })

  document.addEventListener("mousedown", (e) => {
    if (!viewerState.tool) return
    if (e.target.closest(TEXT_LAYER_SELECTOR)) return
    window.getSelection()?.removeAllRanges()
  })
}

function getPageFromTextLayer(textLayer, getCurrentPage) {
  const wrapper = textLayer.closest("[data-page]")
  return wrapper ? parseInt(wrapper.dataset.page, 10) : getCurrentPage()
}

function resolveTextLayer(range, viewer) {
  if (isScrollMode()) {
    const node = range.startContainer
    const el   = node.nodeType === Node.TEXT_NODE ? node.parentElement : node
    return el.closest(TEXT_LAYER_SELECTOR)
  }
  return viewer.querySelector(TEXT_LAYER_SELECTOR)
}

function getSpanOffsets(range, span) {
  const textNode = span.firstChild
  if (textNode?.nodeType !== Node.TEXT_NODE) return null

  const spanRange = document.createRange()
  spanRange.selectNodeContents(span)

  if (range.compareBoundaryPoints(Range.END_TO_START, spanRange) >= 0) return null
  if (range.compareBoundaryPoints(Range.START_TO_END, spanRange) <= 0) return null

  const startOffset = textNode === range.startContainer ? range.startOffset : 0
  const endOffset   = textNode === range.endContainer   ? range.endOffset   : textNode.length

  if (startOffset >= endOffset) return null
  return { startOffset, endOffset }
}