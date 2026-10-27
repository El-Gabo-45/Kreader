import { state }                                                  from "./state.js"
import { getTextLayers, createRange, isTextNode, SPAN_SELECTOR }  from "./domHelpers.js"
import { renderSearchOverlays, clearSearchOverlays }              from "./searchRenderer.js"
import { applySearchAnnotation, renderSearchAnnotations,
         removeSearchAnnotations }                                 from "../annotations/index.js"

export { setCurrentPageGetter, setOverlayContainer } from "./state.js"
export { renderSearchAnnotations }                   from "../annotations/index.js"

// Rastrea qué tool+word está activo para poder hacer toggle
const activeSearch = { tool: null, word: null }

export function hasMatches() {
  return state.matches.length > 0
}

export function clearMatches() {
  clearSearchOverlays()
  state.matches      = []
  state.currentIndex = -1
}

export function searchWords({ container: textLayer, word }) {
  clearMatches()
  if (typeof word !== "string" || !word.trim()) return state.matches

  const query   = word.toLowerCase()
  const layers  = getTextLayers()
  const targets = layers.length ? layers : [textLayer]

  for (const layer of targets) {
    if (!layer) continue

    for (const span of layer.querySelectorAll(SPAN_SELECTOR)) {
      const textNode = span.firstChild
      if (!isTextNode(textNode)) continue

      const text  = textNode.textContent || ""
      const lower = text.toLowerCase()
      let   index = lower.indexOf(query)

      while (index !== -1) {
        state.matches.push({ span, range: createRange(textNode, index, index + word.length), layer })
        index = lower.indexOf(query, index + 1)
      }
    }
  }

  if (state.matches.length > 0) {
    state.currentIndex = 0
    renderSearchOverlays()
  }

  return state.matches
}

export function searchNext() {
  if (!state.matches.length) return
  state.currentIndex = (state.currentIndex + 1) % state.matches.length
  renderSearchOverlays()
}

export function searchPrev() {
  if (!state.matches.length) return
  state.currentIndex = (state.currentIndex - 1 + state.matches.length) % state.matches.length
  renderSearchOverlays()
}

export function highlightMatches({ color, word }) {
  if (activeSearch.tool === "highlight" && activeSearch.word === word) {
    removeSearchAnnotations({ tool: "highlight", word })
    activeSearch.tool = null
    activeSearch.word = null
    return
  }

  applySearchAnnotation({ color, tool: "highlight", matches: state.matches, word })
  activeSearch.tool = "highlight"
  activeSearch.word = word
  clearMatches()
}

export function underlineMatches({ color, word }) {
  if (activeSearch.tool === "underline" && activeSearch.word === word) {
    removeSearchAnnotations({ tool: "underline", word })
    activeSearch.tool = null
    activeSearch.word = null
    return
  }

  applySearchAnnotation({ color, tool: "underline", matches: state.matches, word })
  activeSearch.tool = "underline"
  activeSearch.word = word
  clearMatches()
}