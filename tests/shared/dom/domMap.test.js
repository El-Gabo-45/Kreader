import { describe, it, expect } from "vitest"
import { createDomMap } from "../../../shared/dom/domMap.js"

describe("createDomMap", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  it("devuelve las referencias de los elementos del DOM", () => {
    const viewer = document.createElement("div")
    viewer.id = "viewer"
    const canvas = document.createElement("canvas")
    canvas.id = "pdf-canvas"
    const textLayer = document.createElement("div")
    textLayer.id = "text-layer"
    viewer.appendChild(canvas)
    viewer.appendChild(textLayer)
    document.body.appendChild(viewer)

    const btnH = document.createElement("button")
    btnH.className = "toolbar__button--highlight"
    const btnU = document.createElement("button")
    btnU.className = "toolbar__button--underline"
    document.body.appendChild(btnH)
    document.body.appendChild(btnU)

    const input = document.createElement("input")
    input.className = "toolbar__popup__search-input"
    const button = document.createElement("button")
    button.className = "toolbar__popup__search-button--next"
    document.body.appendChild(input)
    document.body.appendChild(button)

    const ci = document.createElement("input")
    ci.className = "toolbar__popup__customcolor-input"
    document.body.appendChild(ci)

    const dom = createDomMap()

    expect(dom.viewer).toBe(viewer)
    expect(dom.canvas).toBe(canvas)
    expect(dom.textLayer).toBe(textLayer)
    expect(dom.toolbar.highlightBtn).toBe(btnH)
    expect(dom.toolbar.underlineBtn).toBe(btnU)
    expect(dom.search.input).toBe(input)
    expect(dom.search.button).toBe(button)
    expect(dom.colorInputs).toContain(ci)
  })

  it("devuelve null para elementos que no existen", () => {
    const dom = createDomMap()
    expect(dom.viewer).toBeNull()
    expect(dom.canvas).toBeNull()
    expect(dom.textLayer).toBeNull()
    expect(dom.toolbar.highlightBtn).toBeNull()
    expect(dom.search.input).toBeNull()
  })
})
