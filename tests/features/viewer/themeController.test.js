import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initTheme } from "../../../features/viewer/themeController.js"

describe("themeController", () => {
  let btn, moon, sun

  beforeEach(() => {
    document.body.innerHTML = ""
    document.documentElement.removeAttribute("data-theme")
    btn = document.createElement("button")
    btn.className = "toolbar__button--themeswitch"
    moon = document.createElement("span")
    moon.id = "moon"
    sun = document.createElement("span")
    sun.id = "sun"
    document.body.appendChild(btn)
    document.body.appendChild(moon)
    document.body.appendChild(sun)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    document.documentElement.removeAttribute("data-theme")
  })

  it("aplica tema oscuro según prefers-color-scheme", () => {
    const mq = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }
    vi.spyOn(window, "matchMedia").mockReturnValue(mq)
    initTheme()
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    expect(moon.style.display).toBe("none")
    expect(sun.style.display).toBe("block")
  })

  it("aplica tema claro si no prefiere oscuro", () => {
    const mq = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
    vi.spyOn(window, "matchMedia").mockReturnValue(mq)
    initTheme()
    expect(document.documentElement.getAttribute("data-theme")).toBe("light")
    expect(moon.style.display).toBe("block")
    expect(sun.style.display).toBe("none")
  })

  it("alternar tema al hacer clic en el botón", () => {
    const mq = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
    vi.spyOn(window, "matchMedia").mockReturnValue(mq)
    initTheme()
    expect(document.documentElement.getAttribute("data-theme")).toBe("light")

    btn.click()
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    expect(mq.removeEventListener).toHaveBeenCalled()
  })

  it("no falla si no hay botón", () => {
    document.body.innerHTML = ""
    const mq = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }
    vi.spyOn(window, "matchMedia").mockReturnValue(mq)
    expect(() => initTheme()).not.toThrow()
  })
})
