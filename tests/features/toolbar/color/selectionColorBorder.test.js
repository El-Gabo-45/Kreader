import { describe, it, expect, beforeEach } from "vitest"
import { selectionColorBorder, clearColorSelection } from "../../../features/toolbar/color/selectionColorBorder.js"

describe("selectionColorBorder", () => {
  beforeEach(() => {
    // Reset del estado del módulo
    clearColorSelection()
  })

  it("no hace nada si svg es null", () => {
    expect(() => selectionColorBorder(null)).not.toThrow()
  })

  it("marca el svg como selected y lo recuerda", () => {
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg")

    selectionColorBorder(svg1)
    expect(svg1.classList.contains("selected")).toBe(true)

    selectionColorBorder(svg2)
    expect(svg2.classList.contains("selected")).toBe(true)
    expect(svg1.classList.contains("selected")).toBe(false) // se deseleccionó el anterior
  })

  it("clearColorSelection limpia la selección", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    selectionColorBorder(svg)
    clearColorSelection()
    expect(svg.classList.contains("selected")).toBe(false)
  })

  it("clearColorSelection no lanza si no hay selección previa", () => {
    expect(() => clearColorSelection()).not.toThrow()
  })
})
