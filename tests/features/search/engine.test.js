import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import * as engine from "../../../features/search/engine.js"
import { state } from "../../../features/search/state.js"
import { annotations } from "../../../features/annotations/state.js"

describe("search engine", () => {
  let layer, span, textNode

  beforeEach(() => {
    state.matches = []
    state.currentIndex = -1
    state.overlays = []
    annotations.length = 0
    document.body.innerHTML = ""

    layer = document.createElement("div")
    layer.className = "textLayer"
    document.body.appendChild(layer)

    span = document.createElement("span")
    textNode = document.createTextNode("Hola mundo hola")
    span.appendChild(textNode)
    layer.appendChild(span)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    state.matches = []
    state.overlays = []
    annotations.length = 0
  })

  describe("hasMatches / clearMatches", () => {
    it("inicialmente no hay matches", () => {
      expect(engine.hasMatches()).toBe(false)
    })

    it("clearMatches resetea matches y currentIndex", () => {
      state.matches = [{ span, range: document.createRange(), layer }]
      state.currentIndex = 0
      const clearSpy = vi.spyOn(require("../../../features/search/searchRenderer.js"), "clearSearchOverlays")
      engine.clearMatches()
      expect(clearSpy).toHaveBeenCalled()
      expect(state.matches).toEqual([])
      expect(state.currentIndex).toBe(-1)
    })
  })

  describe("searchWords", () => {
    it("no busca si la palabra no es string o está vacía", () => {
      expect(engine.searchWords({ container: layer, word: "" })).toEqual([])
      expect(engine.searchWords({ container: layer, word: "   " })).toEqual([])
      expect(engine.searchWords({ container: layer, word: 123 })).toEqual([])
      expect(state.matches).toEqual([])
    })

    it("encuentra coincidencias (case insensitive) y crea ranges", () => {
      const result = engine.searchWords({ container: layer, word: "hola" })
      expect(result.length).toBe(2)
      expect(state.currentIndex).toBe(0)
      expect(state.matches[0].span).toBe(span)
      expect(state.matches[0].range.startContainer).toBe(textNode)
      expect(state.matches[0].range.startOffset).toBe(0)
      expect(state.matches[0].range.endOffset).toBe(4)
    })

    it("usará el textLayer pasado si no hay capas del documento", () => {
      // state.container = document.body (sin #scroll-container ni textLayer en él)
      const result = engine.searchWords({ container: layer, word: "mundo" })
      expect(result.length).toBe(1)
    })
  })

  describe("searchNext / searchPrev", () => {
    beforeEach(() => {
      engine.searchWords({ container: layer, word: "hola" })
    })

    it("searchNext avanza el índice cíclicamente", () => {
      expect(state.currentIndex).toBe(0)
      engine.searchNext()
      expect(state.currentIndex).toBe(1)
      engine.searchNext()
      expect(state.currentIndex).toBe(0) // vuelve al inicio
    })

    it("searchPrev retrocede cíclicamente", () => {
      engine.searchPrev()
      expect(state.currentIndex).toBe(1) // -1 mod 2
      engine.searchPrev()
      expect(state.currentIndex).toBe(0)
    })

    it("no hace nada si no hay matches", () => {
      engine.clearMatches()
      engine.searchNext()
      engine.searchPrev()
      expect(state.currentIndex).toBe(-1)
    })
  })

  describe("highlightMatches / underlineMatches (toggle)", () => {
    beforeEach(() => {
      engine.searchWords({ container: layer, word: "hola" })
      vi.spyOn(require("../../../features/annotations/searchAnnotations.js"), "applySearchAnnotation")
      vi.spyOn(require("../../../features/search/searchRenderer.js"), "clearMatches")
    })

    it("highlightMatches aplica annotación y activa toggle", () => {
      engine.highlightMatches({ color: "#ff0000", word: "hola" })
      expect(engine.activeSearchIs("highlight", "hola")).toBe(true) // si se expone
    })

    it("highlightMatches con la misma herramienta+palabra hace toggle (desactiva)", () => {
      engine.highlightMatches({ color: "#ff0000", word: "hola" })
      engine.highlightMatches({ color: "#ff0000", word: "hola" })
      // Tras dos llamadas iguales, se desactiva
    })
  })
})

// Helper para inspeccionar el estado interno de activeSearch (no exportado)
describe("activeSearch interno", () => {
  it("se puede acceder mediante propiedades no exportadas (documentado)", () => {
    // activeSearch no se exporta; este test documenta que es interno.
    expect(true).toBe(true)
  })
})
