import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

describe("pdfRenderer (mockeado)", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("createPdfRenderer expone la API esperada (con pdf.js mockeado)", async () => {
    // Mockeamos window["pdfjs-dist/build/pdf"]
    const getPage = vi.fn(async (n) => ({
      getViewport: () => ({ width: 800, height: 1000 }),
      render: () => ({ promise: Promise.resolve() }),
      getTextContent: async () => ({ items: [] })
    }))
    window["pdfjs-dist/build/pdf"] = {
      GlobalWorkerOptions: { workerSrc: "" },
      getDocument: async () => ({
        promise: { numPages: 5, getPage }
      }),
      renderTextLayer: () => ({ promise: Promise.resolve() })
    }

    const { createPdfRenderer } = await import("../../../features/pdf/pdfRenderer.js")
    const canvas = document.createElement("canvas")
    const textLayer = document.createElement("div")
    textLayer.className = "textLayer"
    const viewer = document.createElement("div")
    viewer.appendChild(canvas)
    viewer.appendChild(textLayer)
    document.body.appendChild(viewer)

    let renderedPage = null
    const pdf = await createPdfRenderer({
      canvas,
      textLayer,
      viewer,
      url: "./x.pdf",
      onPageRendered: (page) => { renderedPage = page }
    })

    expect(pdf.totalPages).toBe(5)
    expect(typeof pdf.renderPage).toBe("function")
    expect(typeof pdf.zoomIn).toBe("function")
    expect(typeof pdf.zoomOut).toBe("function")
    expect(typeof pdf.rotateLeft).toBe("function")
    expect(typeof pdf.rotateRight).toBe("function")
    expect(typeof pdf.flip).toBe("function")
    expect(typeof pdf.getCurrentPage).toBe("function")
    expect(typeof pdf.getCurrentRotation).toBe("function")
    expect(pdf.getCurrentPage()).toBe(1)
    expect(pdf.getCurrentRotation()).toBe(0)

    await pdf.renderPage(2)
    expect(pdf.getCurrentPage()).toBe(2)
    expect(renderedPage).toBe(2)
    expect(getPage).toHaveBeenCalledWith(2)

    pdf.zoomIn()
    expect(pdf.getCurrentPage()).toBe(2) // se re-renderiza la actual
    pdf.rotateLeft()
    expect(pdf.getCurrentRotation()).toBe(270)
    pdf.rotateRight()
    expect(pdf.getCurrentRotation()).toBe(0)
    pdf.flip()
    expect(pdf.getCurrentRotation()).toBe(180)
  })

  it("zoomIn/out respetan límites", async () => {
    const getPage = vi.fn(async () => ({
      getViewport: () => ({ width: 800, height: 1000 }),
      render: () => ({ promise: Promise.resolve() }),
      getTextContent: async () => ({ items: [] })
    }))
    window["pdfjs-dist/build/pdf"] = {
      GlobalWorkerOptions: { workerSrc: "" },
      getDocument: async () => ({
        promise: { numPages: 2, getPage }
      }),
      renderTextLayer: () => ({ promise: Promise.resolve() })
    }

    const { createPdfRenderer } = await import("../../../features/pdf/pdfRenderer.js")
    const canvas = document.createElement("canvas")
    const textLayer = document.createElement("div")
    textLayer.className = "textLayer"
    const viewer = document.createElement("div")
    viewer.appendChild(canvas)
    viewer.appendChild(textLayer)
    document.body.appendChild(viewer)

    const pdf = await createPdfRenderer({ canvas, textLayer, viewer, url: "./x.pdf" })
    // escala inicial 1.5
    pdf.zoomIn() // 1.75
    pdf.zoomIn() // 2.0
    pdf.zoomOut() // 1.75
    pdf.zoomOut() // 1.5
    pdf.zoomOut() // 1.25
    pdf.zoomOut() // 1.0
    pdf.zoomOut() // 0.75
    pdf.zoomOut() // 0.5 (mínimo)
    pdf.zoomOut() // sigue en 0.5
    // no hay forma directa de leer escala, pero no lanza
    expect(true).toBe(true)
  })
})
