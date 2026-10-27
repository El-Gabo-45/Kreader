import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initColorSelection } from "../../../features/toolbar/color/colorSelectionController.js"

describe("colorSelectionController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("llama a selectionColorBorder y setColor al hacer clic en un botón de color", () => {
    const setColorSpy = vi.spyOn(require("../../../shared/state/viewerState.js"), "setColor")
    const borderSpy = vi.spyOn(require("../../../features/toolbar/color/selectionColorBorder.js"), "selectionColorBorder")

    const popup = document.createElement("div")
    popup.className = "toolbar__popup--highlight"
    const btn = document.createElement("button")
    btn.className = "toolbar__popup__color"
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle.setAttribute("fill", "#ff0000")
    svg.appendChild(circle)
    btn.appendChild(svg)
    popup.appendChild(btn)
    document.body.appendChild(popup)

    initColorSelection()

    btn.click()
    expect(borderSpy).toHaveBeenCalledWith(svg)
    expect(setColorSpy).toHaveBeenCalledWith("#ff0000")
  })

  it("ignora clics fuera de botones de color", () => {
    const setColorSpy = vi.spyOn(require("../../../shared/state/viewerState.js"), "setColor")
    initColorSelection()
    document.body.click()
    expect(setColorSpy).not.toHaveBeenCalled()
  })
})
