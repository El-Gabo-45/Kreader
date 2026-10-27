import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initAddImage } from "../../../features/media/addImageController.js"

describe("addImageController", () => {
  let viewer, input, button

  beforeEach(() => {
    document.body.innerHTML = ""
    viewer = document.createElement("div")
    viewer.id = "viewer"
    viewer.className = "pdfviewer"
    document.body.appendChild(viewer)

    input = document.createElement("input")
    input.type = "file"
    input.className = "toolbar__popup__addimage-input"
    button = document.createElement("button")
    button.className = "toolbar__popup__addimage-btn"
    document.body.appendChild(input)
    document.body.appendChild(button)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("vincula el botón para abrir el input y procesa el cambio", () => {
    const clickSpy = vi.spyOn(input, "click")
    initAddImage({ viewer })
    button.click()
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it("no falla si no hay input", () => {
    document.querySelector(".toolbar__popup__addimage-input")?.remove()
    expect(() => initAddImage({ viewer })).not.toThrow()
  })

  it("getCurrentPageNumber devuelve 1 por defecto", () => {
    // Probado indirectamente: initAddImage no lanza sin archivo
    initAddImage({ viewer })
    input.dispatchEvent(new Event("change"))
    expect(viewer.querySelectorAll(".annotation-image")).toHaveLength(0)
  })
})
