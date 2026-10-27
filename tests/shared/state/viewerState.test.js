import { describe, it, expect, beforeEach } from "vitest"
import {
  viewerState,
  setTool,
  setThickness,
  setColor,
  getColor
} from "../../../shared/state/viewerState.js"

describe("viewerState", () => {
  beforeEach(() => {
    viewerState.tool = null
    viewerState.color = { highlight: "#ffff00", underline: "#000000", default: "#ffff00" }
    viewerState.page = 1
    viewerState.zoom = 1.5
    viewerState.thickness = { highlight: 10, underline: 2 }
  })

  describe("setTool / getColor", () => {
    it("devuelve el color default cuando no hay tool", () => {
      setTool(null)
      expect(getColor()).toBe("#ffff00")
    })

    it("devuelve el color del tool activo", () => {
      setTool("highlight")
      expect(getColor()).toBe("#ffff00")
      setTool("underline")
      expect(getColor()).toBe("#000000")
    })

    it("setColor actualiza el color del tool activo", () => {
      setTool("highlight")
      setColor("#ff0000")
      expect(getColor()).toBe("#ff0000")
    })

    it("setColor sin tool actualiza el default", () => {
      setTool(null)
      setColor("#abcdef")
      expect(getColor()).toBe("#abcdef")
    })
  })

  describe("setThickness", () => {
    it("actualiza el grosor de una herramienta", () => {
      setThickness("highlight", 20)
      expect(viewerState.thickness.highlight).toBe(20)
    })

    it("actualiza el grosor de underline", () => {
      setThickness("underline", 5)
      expect(viewerState.thickness.underline).toBe(5)
    })
  })
})
