import { setTool, viewerState } from "../../shared/state/viewerState.js"

export function createToolbarController({ highlightBtn, underlineBtn }) {

  const activeButtons = document.querySelectorAll(
    ".toolbar__button--highlight, .toolbar__button--underline, .toolbar__button--grab, .toolbar__button--signature"
  )

  function deactivateAll() {
    activeButtons.forEach(b => b.classList.remove("toolbar__button--active"))
    setTool(null)
  }

  highlightBtn.addEventListener("click", e => {
    e.stopPropagation()
    if (viewerState.tool === "highlight") {
      deactivateAll()
    } else {
      highlightBtn.classList.add("toolbar__button--active")
      underlineBtn.classList.remove("toolbar__button--active")
      setTool("highlight")
    }
  })

  underlineBtn.addEventListener("click", e => {
    e.stopPropagation()
    if (viewerState.tool === "underline") {
      deactivateAll()
    } else {
      underlineBtn.classList.add("toolbar__button--active")
      highlightBtn.classList.remove("toolbar__button--active")
      setTool("underline")
    }
  })

  document.addEventListener("click", e => {
    if (e.target.closest(".toolbar"))    return
    if (e.target.closest(".pdfviewer")) return
    if (e.target.closest(".clr-picker")) return
    deactivateAll()
  })

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") deactivateAll()
  })
}