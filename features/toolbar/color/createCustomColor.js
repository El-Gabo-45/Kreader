const MAX_CUSTOM_COLORS = 5
const SVG_NS = "http://www.w3.org/2000/svg"

export function createCustomColor(container, colorHex) {
  if (!container || !isValidHex(colorHex)) return

  if (getCustomColorCount(container) >= MAX_CUSTOM_COLORS) return

  const button = createColorButton(colorHex)
  container.appendChild(button)

  return button
}

function getCustomColorCount(container) {
  return container.querySelectorAll(".toolbar__popup__color--custom").length
}

function createColorButton(color) {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "toolbar__popup__color toolbar__popup__color--custom"

  button.appendChild(createColorSVG(color))

  return button
}

function createColorSVG(color) {
  const svg = document.createElementNS(SVG_NS, "svg")

  svg.setAttribute("width", "24")
  svg.setAttribute("height", "24")
  svg.setAttribute("fill", "none")
  svg.setAttribute("stroke", "currentColor")
  svg.setAttribute("stroke-width", "2")
  svg.setAttribute("stroke-linecap", "round")
  svg.setAttribute("stroke-linejoin", "round")

  const circle = document.createElementNS(SVG_NS, "circle")

  circle.setAttribute("cx", "12")
  circle.setAttribute("cy", "12")
  circle.setAttribute("r", "10")
  circle.setAttribute("fill", color)

  svg.appendChild(circle)

  return svg
}

function isValidHex(color) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)
}