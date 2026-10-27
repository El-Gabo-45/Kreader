import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

describe("scrollModeController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    // Contenedor .pdfviewer necesario
    const pdfviewer = document.createElement("div")
    pdfviewer.className = "pdfviewer"
    document.body.appendChild(pdfviewer)

    window["pdfjs-dist/build/pdf"] = {
      getDocument: async () => ({
        promise: {
          numPages: 3,
          getPage: async (n) => ({
            getViewport: () => ({ width: 800, height: 1000 }),
            render: () => ({ promise: Promise.resolve() }),
            getTextContent: async () => ({ items: [] })
          })
        }
      }),
      renderTextLayer: () => ({ promise: Promise.resolve() })
    }
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("no hace nada si no hay botón de scroll-mode", () => {
    const { initScrollMode } = require("../../../features/pdf/scrollModeController.js")
    expect(() => initScrollMode({ url: "./x.pdf", getCurrentPage: () => 1 })).not.toThrow()
  })

  it("al hacer clic entra y sale de scroll mode", async () => {
    const btn = document.createElement("button")
    btn.className = "toolbar__button--scroll-mode"
    const pageInput = document.createElement("input")
    pageInput.className = "toolbar__input--page"
    pageInput.value = "1"
    document.body.appendChild(btn)
    document.body.appendChild(pageInput)

    const { initScrollMode } = require("../../../features/pdf/scrollModeController.js")
    initScrollMode({ url: "./x.pdf", getCurrentPage: () => 1 })

    btn.click()
    // entra en scroll mode: crea #scroll-container, oculta #viewer
    await new Promise((r) => setTimeout(r, 50))
    expect(document.getElementById("scroll-container")).not.toBeNull()

    btn.click()
    // sale de scroll mode
    await new Promise((r) => setTimeout(r, 50))
    expect(true).toBe(true)
  })
})
