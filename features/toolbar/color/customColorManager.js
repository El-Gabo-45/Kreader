import { setColor }              from "../../../shared/state/viewerState.js"
import { createCustomColor }     from "./createCustomColor.js"
import { selectionColorBorder }  from "./selectionColorBorder.js"

export function mapInputsToContainers(inputs) {
  const map = new Map()

  inputs.forEach(input => {
    const popup     = input.closest(".toolbar__popup")
    const container = popup?.querySelector(".toolbar__popup-colors")
    if (container) map.set(input, container)
  })

  return map
}

export function confirmCustomColor(activeInput, pendingColor, containerMap) {
  if (!activeInput || !pendingColor) return

  const container = containerMap.get(activeInput)
  if (!container) return

  if (!customColorExists(container, pendingColor)) {
    createCustomColor(container, pendingColor)
  }

  selectCustomColor(container, pendingColor)
}

function customColorExists(container, color) {
  return [...container.querySelectorAll(".toolbar__popup__color--custom")]
    .some(btn => btn.querySelector("circle")?.getAttribute("fill") === color)
}

function selectCustomColor(container, color) {
  const button = [...container.querySelectorAll(".toolbar__popup__color--custom")]
    .find(btn => btn.querySelector("circle")?.getAttribute("fill") === color)

  if (!button) return

  const svg = button.querySelector("svg")
  if (svg) selectionColorBorder(svg)

  setColor(color)
}

export function applyInputColor(input, color) {
  input.value                 = color
  input.style.backgroundColor = color
  input.style.color           = isLight(color) ? "#000" : "#fff"
}

function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}