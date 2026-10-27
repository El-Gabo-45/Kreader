import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  renderSearchOverlays,
  clearSearchOverlays,
  createHighlightOverlay,
  createUnderlineOverlay
} from "../../../features/search/searchRenderer.js"
import { state } from "../../../features/search/state.js"

describe("searchRenderer", () => {
  let layer, layerRectSpy

  beforeEach(() => {
    document.body.innerHTML = ""
    state.matches = []
    state.overlays = []
    state.currentIndex = -1

    layer = document.createElement("div")
    layer.className = "textLayer"
    layer.getBoundingClientRect = vi.fn(() => ({
      left: 0, top: 0, width: 800, height: 1000,
      right: 800, bottom: 1000, x: 0, y: 0, toJSON: () => {}
    }))
    document.body.appendChild(layer)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    state.matches = []
    state.overlays = []
  })

  describe("clearSearchOverlays", () => {
    it("elimina los overlays previos y vacía el array", () => {
      const o1 = document.createElement("div")
      layer.appendChild(o1)
      state.overlays.push(o1)
      clearSearchOverlays()
      expect(o1.isConnected).toBe(false)
      expect(state.overlays).toHaveLength(0)
    })
  })

  describe("renderSearchOverlays", () => {
    it("no renderiza si no hay matches", () => {
      renderSearchOverlays()
      expect(layer.querySelectorAll(".search-overlay")).toHaveLength(0)
    })

    it("crea overlays para cada rect de cada match", () => {
      const span = document.createElement("span")
      const textNode = document.createTextNode("hola mundo")
      span.appendChild(textNode)
      layer.appendChild(span)

      // getClientRects devuelve un rect simulado
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 5) // "hola"
      vi.spyOn(range, "getClientRects").mockReturnValue([
        { left: 10, top: 20, width: 30, height: 10 }
      ])

      state.matches = [{ span, range, layer }]
      state.currentIndex = 0

      renderSearchOverlays()
      const overlays = layer.querySelectorAll(".search-overlay")
      expect(overlays).toHaveLength(1)
      expect(overlays[0].classList.contains("search-overlay--active")).toBe(true)
      expect(state.overlays).toHaveLength(1)
    })
  })

  describe("createHighlightOverlay", () => {
    it("crea un overlay de highlight con color", () => {
      const overlay = createHighlightOverlay(
        { left: 5, top: 5, width: 20, height: 10 },
        { left: 0, top: 0, width: 800, height: 1000 },
        "#ff0000"
      )
      expect(overlay.className).toContain("search-annotation-overlay")
      expect(overlay.style.backgroundColor).toBe("#ff0000")
      expect(overlay.style.position).toBe("absolute")
    })
  })

  describe("createUnderlineOverlay", () => {
    it("crea un overlay de underline con altura fija", () => {
      const overlay = createUnderlineOverlay(
        { left: 5, top: 20, width: 20, height: 10 },
        { left: 0, top: 0, width: 800, height: 1000 },
        "#000000"
      )
      expect(overlay.style.height).toBe("2px")
      expect(overlay.style.backgroundColor).toBe("#000000")
    })
  })
})
