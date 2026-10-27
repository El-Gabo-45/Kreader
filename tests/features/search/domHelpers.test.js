import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  TEXT_LAYER_SELECTOR,
  SPAN_SELECTOR,
  getTextLayers,
  createRange,
  isTextNode,
  applyRect,
  applyCommonOverlayStyles
} from "../../../features/search/domHelpers.js"
import { state } from "../../../features/search/state.js"

describe("domHelpers", () => {
  let container, layer

  beforeEach(() => {
    document.body.innerHTML = ""
    container = document.createElement("div")
    container.id = "scroll-container"
    document.body.appendChild(container)
    layer = document.createElement("div")
    layer.className = "textLayer"
    container.appendChild(layer)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    state.container = document.body
  })

  describe("getTextLayers", () => {
    it("devuelve los textLayer dentro de #scroll-container si existe", () => {
      const l2 = layer.cloneNode()
      container.appendChild(l2)
      const result = getTextLayers()
      expect(result).toHaveLength(2)
      expect(result).toContain(layer)
      expect(result).toContain(l2)
    })

    it("devuelve el textLayer del contenedor state.container si no hay scroll-container", () => {
      document.getElementById("scroll-container").remove()
      state.container = container
      const result = getTextLayers()
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(layer)
    })

    it("devuelve array vacío si no hay textLayer", () => {
      document.getElementById("scroll-container").remove()
      state.container = document.body
      expect(getTextLayers()).toEqual([])
    })
  })

  describe("createRange", () => {
    it("crea un Range con start y end", () => {
      const textNode = document.createTextNode("hola")
      const range = createRange(textNode, 0, 2)
      expect(range.startContainer).toBe(textNode)
      expect(range.startOffset).toBe(0)
      expect(range.endContainer).toBe(textNode)
      expect(range.endOffset).toBe(2)
    })
  })

  describe("isTextNode", () => {
    it("detecta nodos de texto", () => {
      const textNode = document.createTextNode("x")
      const element = document.createElement("div")
      expect(isTextNode(textNode)).toBe(true)
      expect(isTextNode(element)).toBe(false)
      expect(isTextNode(null)).toBe(false)
      expect(isTextNode(undefined)).toBe(false)
    })
  })

  describe("applyRect", () => {
    it("posiciona un elemento de forma absoluta relativa al layer", () => {
      const el = document.createElement("div")
      const rect = { left: 100, top: 50, width: 30, height: 10 }
      const layerRect = { left: 10, top: 20 }
      applyRect(el, rect, layerRect)
      expect(el.style.position).toBe("absolute")
      expect(el.style.left).toBe("90px")
      expect(el.style.top).toBe("30px")
      expect(el.style.width).toBe("30px")
      expect(el.style.height).toBe("10px")
    })
  })

  describe("applyCommonOverlayStyles", () => {
    it("aplica estilos comunes de overlay", () => {
      const el = document.createElement("div")
      applyCommonOverlayStyles(el, 10)
      expect(el.style.pointerEvents).toBe("none")
      expect(el.style.zIndex).toBe("10")
      expect(el.style.mixBlendMode).toBe("multiply")
    })
  })
})
