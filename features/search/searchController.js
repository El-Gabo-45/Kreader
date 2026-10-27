import * as searchEngine          from "./engine.js"
import { viewerState, getColor }  from "../../shared/state/viewerState.js"

export function initSearch({ textLayer }) {
  const input        = document.querySelector(".toolbar__popup__search-input")
  const nextBtn      = document.querySelector(".toolbar__popup__search-button--next")
  const prevBtn      = document.querySelector(".toolbar__popup__search-button--prev")
  const highlightBtn = document.querySelector(".toolbar__popup__search-button--highlight")
  const underlineBtn = document.querySelector(".toolbar__popup__search-button--underline")

  if (!input) return

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      searchEngine.searchWords({ container: textLayer, word: input.value })
    }
  })

  nextBtn?.addEventListener("click", searchEngine.searchNext)
  prevBtn?.addEventListener("click", searchEngine.searchPrev)

  highlightBtn?.addEventListener("click", () => {
    viewerState.tool = "highlight"
    searchEngine.highlightMatches({ color: getColor() })
    viewerState.tool = null
  })

  underlineBtn?.addEventListener("click", () => {
    viewerState.tool = "underline"
    searchEngine.underlineMatches({ color: getColor() })
    viewerState.tool = null
  })
}