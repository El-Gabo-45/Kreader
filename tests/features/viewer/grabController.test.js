import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { initGrab } from "../../../features/viewer/grabController.js"

describe("grabController", () => {
  let btn, pdfviewer

  beforeEach(() => {
    document.body.innerHTML = ""
    btn = document.createElement("button")
    btn.className = "toolbar__button--grab"
    pdfviewer = document.createElement("div")
    pdfviewer.className = "pdfviewer"
    document.body.appendChild(btn)
    document.body.appendChild(pdfviewer)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("activa/desactiva grab y añade/quita clase", () => {
    initGrab()
    expect(btn.classList.contains("toolbar__button--active")).toBe(false)

    btn.click()
    expect(btn.classList.contains("toolbar__button--active")).toBe(true)
    expect(pdfviewer.style.cursor).toBe("grab")

    btn.click()
    expect(btn.classList.contains("toolbar__button--active")).toBe(false)
    expect(pdfviewer.style.cursor).toBe("")
  })

  it("no falla si no hay botón", () => {
    document.body.innerHTML = ""
    expect(() => initGrab()).not.toThrow()
  })
})
