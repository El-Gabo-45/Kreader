import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  applySearchAnnotation,
  removeSearchAnnotations,
  renderSearchAnnotations
} from "../../../features/annotations/searchAnnotations.js"
import { annotations } from "../../../features/annotations/state.js"
import { setCurrentPageGetter } from "../../../features/search/state.js"

describe("searchAnnotations", () => {
  let viewer, wrapper, layer, span, textNode

  beforeEach(() => {
    annotations.length = 0
    document.body.innerHTML = ""

    viewer = document.createElement("div")
    viewer.id = "viewer"
    document.body.appendChild(viewer)

    wrapper = document.createElement("div")
    wrapper.dataset.page = "1"
    viewer.appendChild(wrapper)

    layer = document.createElement("div")
    layer.className = "textLayer"
    wrapper.appendChild(layer)

    span = document.createElement("span")
    textNode = document.createTextNode("hola mundo")
    span.appendChild(textNode)
    layer.appendChild(span)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    annotations.length = 0
  })

  describe("applySearchAnnotation", () => {
    it("agrega una anotación por match con source 'search'", () => {
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 4) // "hola"
      const match = { span, range, layer }
      vi.spyOn(layer, "closest").mockReturnValue(wrapper)
      vi.spyOn(layer, "querySelectorAll").mockReturnValue([span])

      applySearchAnnotation({ color: "#ff0000", tool: "highlight", matches: [match], word: "hola" })

      expect(annotations).toHaveLength(1)
      const ann = annotations[0]
      expect(ann.source).toBe("search")
      expect(ann.tool).toBe("highlight")
      expect(ann.color).toBe("#ff0000")
      expect(ann.word).toBe("hola")
      expect(ann.page).toBe(1)
      expect(ann.spanIndex).toBe(0)
      expect(ann.startOffset).toBe(0)
      expect(ann.endOffset).toBe(4)
      expect(ann.thickness).toBe(10)
    })

    it("usa el getter de página actual si no hay wrapper [data-page]", () => {
      setCurrentPageGetter(() => 7)
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 2)
      const match = { span, range, layer }
      vi.spyOn(layer, "closest").mockReturnValue(null)
      vi.spyOn(layer, "querySelectorAll").mockReturnValue([span])

      applySearchAnnotation({ color: "#000", tool: "underline", matches: [match], word: "x" })
      expect(annotations[0].page).toBe(7)
    })

    it("ignora matches cuyo span ya no está en el layer", () => {
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 2)
      const otherSpan = document.createElement("span")
      const match = { span: otherSpan, range, layer }
      vi.spyOn(layer, "closest").mockReturnValue(wrapper)
      vi.spyOn(layer, "querySelectorAll").mockReturnValue([span])

      applySearchAnnotation({ color: "#000", tool: "highlight", matches: [match], word: "x" })
      expect(annotations).toHaveLength(0)
    })
  })

  describe("removeSearchAnnotations", () => {
    it("elimina anotaciones por tool y palabra", () => {
      annotations.push({ source: "search", tool: "highlight", word: "hola", page: 1 })
      annotations.push({ source: "search", tool: "underline", word: "hola", page: 1 })
      annotations.push({ source: "search", tool: "highlight", word: "mundo", page: 1 })
      annotations.push({ source: "selection", tool: "highlight", word: "hola", page: 1 })

      removeSearchAnnotations({ tool: "highlight", word: "hola" })

      expect(annotations).toHaveLength(2)
      expect(annotations.every(a => !(a.tool === "highlight" && a.word === "hola"))).toBe(true)
      expect(annotations.find(a => a.source === "selection")).toBeDefined()
    })

    it("no renderiza si no hubo cambios", () => {
      const renderSpy = vi.spyOn(require("../../../features/annotations/renderer.js"), "renderAnnotations")
      removeSearchAnnotations({ tool: "highlight", word: "inexistente" })
      expect(renderSpy).not.toHaveBeenCalled()
    })
  })

  describe("renderSearchAnnotations", () => {
    it("llama a renderAnnotations con viewer y página actual", () => {
      const renderSpy = vi.spyOn(require("../../../features/annotations/renderer.js"), "renderAnnotations")
      setCurrentPageGetter(() => 3)
      renderSearchAnnotations()
      expect(renderSpy).toHaveBeenCalledWith(viewer, 3)
    })
  })
})
