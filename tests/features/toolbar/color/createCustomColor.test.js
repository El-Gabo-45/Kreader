import { describe, it, expect, beforeEach } from "vitest"
import { createCustomColor } from "../../../features/toolbar/color/createCustomColor.js"

describe("createCustomColor", () => {
  let container

  beforeEach(() => {
    container = document.createElement("div")
    container.className = "toolbar__popup-colors"
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("no crea nada si container es null", () => {
    const result = createCustomColor(null, "#ff0000")
    expect(result).toBeUndefined()
  })

  it("no crea nada si el color hex es inválido", () => {
    expect(createCustomColor(container, "no-hex")).toBeUndefined()
    expect(createCustomColor(container, "#gggggg")).toBeUndefined()
    expect(createCustomColor(container, "#fff0")).toBeUndefined()
    expect(container.querySelectorAll(".toolbar__popup__color--custom")).toHaveLength(0)
  })

  it("crea un botón de color válido", () => {
    const btn = createCustomColor(container, "#ff0000")
    expect(btn).toBeInstanceOf(HTMLButtonElement)
    expect(btn.classList.contains("toolbar__popup__color--custom")).toBe(true)

    const circle = btn.querySelector("circle")
    expect(circle).not.toBeNull()
    expect(circle.getAttribute("fill")).toBe("#ff0000")
    expect(container.querySelectorAll(".toolbar__popup__color--custom")).toHaveLength(1)
  })

  it("acepta hex corto (#fff)", () => {
    createCustomColor(container, "#fff")
    const circle = container.querySelector("circle")
    expect(circle.getAttribute("fill")).toBe("#fff")
  })

  it("limita a 5 colores personalizados", () => {
    ["#111111", "#222222", "#333333", "#444444", "#555555", "#666666"].forEach((c) =>
      createCustomColor(container, c)
    )
    expect(container.querySelectorAll(".toolbar__popup__color--custom")).toHaveLength(5)
  })
})
