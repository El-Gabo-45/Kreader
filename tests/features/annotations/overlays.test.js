import { describe, it, expect } from "vitest"
import { createOverlay } from "../../../features/annotations/overlays.js"

describe("createOverlay", () => {
  const rect = { left: 10, top: 20, width: 100, height: 20 }

  describe("tool highlight", () => {
    it("dibuja una barra de highlight proporcional al grosor", () => {
      const ann = { tool: "highlight", color: "#ffff00", thickness: 10 }
      const overlay = createOverlay(rect, ann)
      expect(overlay.className).toBe("annotation-overlay")
      expect(overlay.style.position).toBe("absolute")
      expect(overlay.style.left).toBe("10px")
      // h = height * (thickness/10) = 20 * 1 = 20; t = top + height - h = 20
      expect(overlay.style.top).toBe("20px")
      expect(overlay.style.width).toBe("100px")
      expect(overlay.style.height).toBe("20px")
      expect(overlay.style.backgroundColor).toBe("#ffff00")
      expect(overlay.style.mixBlendMode).toBe("multiply")
      expect(overlay.style.pointerEvents).toBe("none")
      expect(overlay.style.zIndex).toBe("5")
    })

    it("con grosor 5 la mitad de la altura", () => {
      const ann = { tool: "highlight", color: "#ff0000", thickness: 5 }
      const overlay = createOverlay(rect, ann)
      // h = 20 * 0.5 = 10; t = 20 + 20 - 10 = 30
      expect(overlay.style.height).toBe("10px")
      expect(overlay.style.top).toBe("30px")
    })
  })

  describe("tool underline", () => {
    it("dibuja una barra del grosor en la parte inferior", () => {
      const ann = { tool: "underline", color: "#000000", thickness: 2 }
      const overlay = createOverlay(rect, ann)
      expect(overlay.style.height).toBe("2px")
      // top = top + height - thickness = 20 + 20 - 2 = 38
      expect(overlay.style.top).toBe("38px")
      expect(overlay.style.backgroundColor).toBe("#000000")
    })
  })

  it("devuelve string vacío para herramienta desconocida", () => {
    const ann = { tool: "otro", color: "#000", thickness: 1 }
    const overlay = createOverlay(rect, ann)
    // buildOverlayStyle retorna "" -> cssText vacío
    expect(overlay.style.cssText).toBe("")
  })
})
