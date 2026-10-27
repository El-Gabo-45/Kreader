import { selectionColorBorder, clearColorSelection } from "./selectionColorBorder.js"
import { setColor } from "../../../shared/state/viewerState.js"

const COLOR_BUTTON_SELECTOR = ".toolbar__popup__color"
const POPUP_SELECTOR = ".toolbar__popup--highlight, .toolbar__popup--underline"

export function initColorSelection() {
  initColorButtonSelection()
  initPopupClearBehavior()
}

function initColorButtonSelection() {
  document.addEventListener("click", handleColorClick)
}

function handleColorClick(event) {
  const button = event.target.closest(COLOR_BUTTON_SELECTOR)
  if (!button) return

  const svg = button.querySelector("svg")
  const circle = button.querySelector("circle")

  if (svg) {
    selectionColorBorder(svg)
  }

  if (!circle) return

  const color = circle.getAttribute("fill")
  if (color) {
    setColor(color)
  }
}

function initPopupClearBehavior() {
  const popups = document.querySelectorAll(POPUP_SELECTOR)

  popups.forEach(popup => {
    popup.addEventListener("click", handlePopupClick)
  })
}

function handlePopupClick(event) {
  if (shouldIgnoreClick(event.target)) return
  clearColorSelection()
}

function shouldIgnoreClick(target) {
  return (
    target.closest(COLOR_BUTTON_SELECTOR) ||
    target.closest(".clr-picker") ||
    target.id === "clr-close" ||
    target.closest("[id^='clr']")
  )
}