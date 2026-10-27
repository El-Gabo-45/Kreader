import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initThickness } from "../../../features/toolbar/color/thicknessController.js"
import { setThickness } from "../../../shared/state/viewerState.js"

describe("thicknessController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.spyOn(setThickness) // referencia para evitar árbol muerto
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("inicializa inputs de grosor y llama a setThickness en input", () => {
    const setSpy = vi.spyOn(require("../../../shared/state/viewerState.js"), "setThickness")

    const highlightPopup = document.createElement("div")
    highlightPopup.className = "toolbar__popup--highlight"
    const hInput = document.createElement("input")
    hInput.className = "toolbar__popup__thickness-input"
    hInput.max = "50"
    highlightPopup.appendChild(hInput)
    document.body.appendChild(highlightPopup)

    const underlinePopup = document.createElement("div")
    underlinePopup.className = "toolbar__popup--underline"
    const uInput = document.createElement("input")
    uInput.className = "toolbar__popup__thickness-input"
    underlinePopup.appendChild(uInput)
    document.body.appendChild(underlinePopup)

    initThickness()

    expect(hInput.value).toBe("10")
    expect(uInput.value).toBe("2")

    hInput.value = "25"
    hInput.dispatchEvent(new Event("input"))
    expect(setSpy).toHaveBeenCalledWith("highlight", 25)

    uInput.value = "4"
    uInput.dispatchEvent(new Event("input"))
    expect(setSpy).toHaveBeenCalledWith("underline", 4)
  })

  it("no falla si no existen los popups", () => {
    expect(() => initThickness()).not.toThrow()
  })
})
