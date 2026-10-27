import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initZoom } from "../../../features/viewer/zoomController.js"

describe("zoomController", () => {
  let zoomInBtn, zoomOutBtn

  beforeEach(() => {
    document.body.innerHTML = ""
    zoomInBtn = document.createElement("button")
    zoomInBtn.className = "toolbar__button--zoom-in"
    zoomOutBtn = document.createElement("button")
    zoomOutBtn.className = "toolbar__button--zoom-out"
    document.body.appendChild(zoomInBtn)
    document.body.appendChild(zoomOutBtn)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("llama a pdf.zoomIn y pdf.zoomOut al hacer clic", () => {
    const pdf = { zoomIn: vi.fn(), zoomOut: vi.fn() }
    initZoom({ pdf })
    zoomInBtn.click()
    expect(pdf.zoomIn).toHaveBeenCalledTimes(1)
    zoomOutBtn.click()
    expect(pdf.zoomOut).toHaveBeenCalledTimes(1)
  })

  it("no falla si los botones no existen", () => {
    document.body.innerHTML = ""
    const pdf = { zoomIn: vi.fn(), zoomOut: vi.fn() }
    expect(() => initZoom({ pdf })).not.toThrow()
    expect(pdf.zoomIn).not.toHaveBeenCalled()
  })
})
