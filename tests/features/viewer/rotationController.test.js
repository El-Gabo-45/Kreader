import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initRotation } from "../../../features/viewer/rotationController.js"

describe("rotationController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("vincula los botones de rotación a los métodos del pdf", () => {
    const rotateLeft = document.createElement("button")
    rotateLeft.className = "toolbar__button--rotateleft"
    const rotateRight = document.createElement("button")
    rotateRight.className = "toolbar__button--rotateright"
    const flip = document.createElement("button")
    flip.className = "toolbar__button--flip"
    document.body.appendChild(rotateLeft)
    document.body.appendChild(rotateRight)
    document.body.appendChild(flip)

    const pdf = { rotateLeft: vi.fn(), rotateRight: vi.fn(), flip: vi.fn() }
    initRotation({ pdf })

    rotateLeft.click()
    expect(pdf.rotateLeft).toHaveBeenCalledTimes(1)
    rotateRight.click()
    expect(pdf.rotateRight).toHaveBeenCalledTimes(1)
    flip.click()
    expect(pdf.flip).toHaveBeenCalledTimes(1)
  })

  it("ignora botones que no existen", () => {
    const pdf = { rotateLeft: vi.fn(), rotateRight: vi.fn(), flip: vi.fn() }
    expect(() => initRotation({ pdf })).not.toThrow()
  })
})
