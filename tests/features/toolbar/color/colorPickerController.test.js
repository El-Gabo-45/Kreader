import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { createColorPickerController } from "../../../features/toolbar/color/colorPickerController.js"

describe("colorPickerController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    // Stubs de Coloris global
    window.Coloris = vi.fn(() => ({}))
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("no falla si no hay inputs", () => {
    expect(() => createColorPickerController({ inputs: [] })).not.toThrow()
  })

  it("aplica color por defecto a cada input", () => {
    const applySpy = vi.spyOn(require("../../../features/toolbar/color/customColorManager.js"), "applyInputColor")
    const input1 = document.createElement("input")
    input1.className = "toolbar__popup__customcolor-input"
    const input2 = document.createElement("input")
    input2.className = "toolbar__popup__customcolor-input"
    document.body.appendChild(input1)
    document.body.appendChild(input2)

    createColorPickerController({ inputs: [input1, input2] })

    expect(applySpy).toHaveBeenCalledWith(input1, "#000000")
    expect(applySpy).toHaveBeenCalledWith(input2, "#000000")
  })
})
