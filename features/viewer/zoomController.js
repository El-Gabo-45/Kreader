import { isScrollMode, getScrollMode } from "../../shared/state/scrollModeState.js"

export function initZoom({ pdf }) {
  document.querySelector(".toolbar__button--zoom-in")?.addEventListener("click", () => {
    if (isScrollMode()) getScrollMode().zoomIn()
    else pdf.zoomIn()
  })

  document.querySelector(".toolbar__button--zoom-out")?.addEventListener("click", () => {
    if (isScrollMode()) getScrollMode().zoomOut()
    else pdf.zoomOut()
  })
}