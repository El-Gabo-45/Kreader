import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  mapInputsToContainers,
  confirmCustomColor,
  applyInputColor
} from "../../../features/toolbar/color/customColorManager.js"

describe("customColorManager", () => {
  let container, input, popup

  beforeEach(() => {
    popup = document.createElement("div")
    popup.className = "toolbar__popup"
    container = document.createElement("div")
    container.className = "toolbar__popup-colors"
    popup.appendChild(container)

    input = document.createElement("input")
    input.className = "toolbar__popup__customcolor-input"
    popup.appendChild(input)
    document.body.appendChild(popup)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  describe("mapInputsToContainers", () => {
    it("mapea cada input a su contenedor de colores", () => {
      const map = mapInputsToContainers([input])
      expect(map.get(input)).toBe(container)
    })

    it("no mapea inputs sin popup ni contenedor", () => {
      const orphan = document.createElement("input")
      orphan.className = "toolbar__popup__customcolor-input"
      const map = mapInputsToContainers([orphan])
      expect(map.size).toBe(0)
    })
  })

  describe("applyInputColor", () => {
    it("aplica el color al valor, fondo y texto del input", () => {
      applyInputColor(input, "#ff0000")
      expect(input.value).toBe("#ff0000")
      expect(input.style.backgroundColor).toBe("rgb(255, 0, 0)")
      expect(input.style.color).toBe("#000") // rojo es oscuro -> texto negro
    })

    it("usa texto blanco en colores claros", () => {
      applyInputColor(input, "#ffff00") // amarillo claro
      expect(input.style.color).toBe("#fff")
    })
  })

  describe("confirmCustomColor", () => {
    it("no hace nada si falta input o color", () => {
      const map = new Map([[input, container]])
      expect(() => confirmCustomColor(null, "#ff0000", map)).not.toThrow()
      expect(() => confirmCustomColor(input, null, map)).not.toThrow()
      expect(() => confirmCustomColor(null, null, map)).not.toThrow()
    })

    it("no hace nada si el input no está en el mapa", () => {
      const map = new Map()
      expect(() => confirmCustomColor(input, "#ff0000", map)).not.toThrow()
    })

    it("no duplica colores existentes", () => {
      const map = new Map([[input, container]])
      createCustomColor(container, "#ff0000")
      confirmCustomColor(input, "#ff0000", map)
      expect(container.querySelectorAll(".toolbar__popup__color--custom")).toHaveLength(1)
    })

    it("crea el color si no existe y lo selecciona", () => {
      const map = new Map([[input, container]])
      confirmCustomColor(input, "#ff0000", map)
      const btns = container.querySelectorAll(".toolbar__popup__color--custom")
      expect(btns).toHaveLength(1)
      expect(btns[0].querySelector("circle").getAttribute("fill")).toBe("#ff0000")
    })
  })
})
