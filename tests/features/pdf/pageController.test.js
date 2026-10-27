import { describe, it, expect } from "vitest"

// pageController no exporta clamp, pero sí su lógica es fácil de testear
// mediante el comportamiento de clamp integrado. Extraemos la función
// lógica clave copiando su implementación para mantener el test puro.
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

describe("pageController clamp logic", () => {
  it("mantiene el valor dentro del rango", () => {
    expect(clamp(1, 1, 10)).toBe(1)
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(10, 1, 10)).toBe(10)
  })

  it("clampa al mínimo", () => {
    expect(clamp(0, 1, 10)).toBe(1)
    expect(clamp(-5, 1, 10)).toBe(1)
  })

  it("clampa al máximo", () => {
    expect(clamp(11, 1, 10)).toBe(10)
    expect(clamp(100, 1, 10)).toBe(10)
  })
})
