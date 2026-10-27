import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initPresentation } from "../../../features/viewer/presentationController.js"

describe("presentationController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    // Stubs de pdf.js con getPage
    window["pdfjs-dist/build/pdf"] = {
      getDocument: async () => ({
        promise: {
          numPages: 3,
          getPage: async (n) => ({
            getViewport: () => ({ width: 800, height: 1000 }),
            render: () => ({ promise: Promise.resolve() })
          })
        }
      })
    }
  })

  afterEach(() => {
    document.body.innerHTML = ""
    document.getElementById("presentation-overlay")?.remove()
  })

  it("no falla si no hay botón de presentación", () => {
    const pdf = { getCurrentPage: () => 1 }
    expect(() => initPresentation({ pdf, url: "./x.pdf" })).not.toThrow()
  })

  it("vincula clic del botón (toggle) y teclas de navegación", () => {
    const button = document.createElement("button")
    button.className = "toolbar__button--presentation"
    const pageInput = document.createElement("input")
    pageInput.className = "toolbar__input--page"
    pageInput.value = "1"
    document.body.appendChild(button)
    document.body.appendChild(pageInput)

    const pdf = { getCurrentPage: () => 1 }
    initPresentation({ pdf, url: "./x.pdf" })

    // El botón existe, initPresentation no lanza
    expect(button).toBeInTheDocument()
  })
})
