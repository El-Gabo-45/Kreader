import { annotations }      from "./state.js"
import { renderAnnotations } from "./renderer.js"
import { SPAN_SELECTOR }     from "../search/domHelpers.js"
import { getCurrentPageFn }  from "../search/state.js"

const SEARCH_HIGHLIGHT_THICKNESS = 10
const SEARCH_UNDERLINE_THICKNESS = 2

export function applySearchAnnotation({ color, tool, matches, word }) {
  for (const { span, range, layer } of matches) {
    const spans   = Array.from(layer.querySelectorAll(SPAN_SELECTOR))
    const spanIdx = spans.indexOf(span)
    if (spanIdx === -1) continue

    const wrapper  = layer.closest("[data-page]")
    const page     = wrapper ? parseInt(wrapper.dataset.page, 10) : getCurrentPageFn()
    const textNode = span.firstChild
    if (textNode?.nodeType !== Node.TEXT_NODE) continue

    annotations.push({
      source:      "search",
      tool,
      color,
      word,        // guardamos la palabra para poder hacer toggle
      page,
      spanIndex:   spanIdx,
      startOffset: range.startContainer === textNode ? range.startOffset : 0,
      endOffset:   range.endContainer   === textNode ? range.endOffset   : textNode.length,
      thickness:   tool === "highlight" ? SEARCH_HIGHLIGHT_THICKNESS : SEARCH_UNDERLINE_THICKNESS
    })
  }

  const viewer      = document.getElementById("viewer")
  const currentPage = getCurrentPageFn()
  renderAnnotations(viewer, currentPage)
}

export function removeSearchAnnotations({ tool, word }) {
  // Borrar del array las anotaciones que coincidan con tool+word
  const before = annotations.length
  for (let i = annotations.length - 1; i >= 0; i--) {
    const ann = annotations[i]
    if (ann.source === "search" && ann.tool === tool && ann.word === word) {
      annotations.splice(i, 1)
    }
  }

  if (annotations.length !== before) {
    const viewer      = document.getElementById("viewer")
    const currentPage = getCurrentPageFn()
    renderAnnotations(viewer, currentPage)
  }
}

export function renderSearchAnnotations(currentPage = null) {
  const viewer = document.getElementById("viewer")
  const page   = currentPage ?? getCurrentPageFn()
  renderAnnotations(viewer, page)
}