import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  setScrollMode,
  getScrollMode,
  isScrollMode,
  onScrollModeChange
} from "../../../shared/state/scrollModeState.js"

describe("scrollModeState", () => {
  beforeEach(() => {
    // Reset del estado del módulo entre tests
    setScrollMode(null)
  })

  describe("setScrollMode / getScrollMode / isScrollMode", () => {
    it("inicialmente no hay scroll mode", () => {
      expect(isScrollMode()).toBe(false)
      expect(getScrollMode()).toBeNull()
    })

    it("setScrollMode guarda la api y activa el modo", () => {
      const api = { goToPage: () => {} }
      setScrollMode(api)
      expect(isScrollMode()).toBe(true)
      expect(getScrollMode()).toBe(api)
    })

    it("setScrollMode(null) desactiva el modo", () => {
      setScrollMode({ goToPage: () => {} })
      setScrollMode(null)
      expect(isScrollMode()).toBe(false)
    })
  })

  describe("onScrollModeChange", () => {
    it("notifica a los listeners al cambiar el modo", () => {
      const fn = vi.fn()
      const unsubscribe = onScrollModeChange(fn)
      setScrollMode({ goToPage: () => {} })
      expect(fn).toHaveBeenCalledWith(true)

      setScrollMode(null)
      expect(fn).toHaveBeenCalledWith(false)
      unsubscribe()
    })

    it("ignora listeners que no son funciones y devuelve unsubscribe no-op", () => {
      const unsubscribe = onScrollModeChange("no-es-funcion")
      expect(typeof unsubscribe).toBe("function")
      setScrollMode({ goToPage: () => {} }) // no debe lanzar
    })

    it("unsubscribe detiene las notificaciones", () => {
      const fn = vi.fn()
      const unsubscribe = onScrollModeChange(fn)
      unsubscribe()
      setScrollMode({ goToPage: () => {} })
      expect(fn).not.toHaveBeenCalled()
    })

    it("no lanza si un listener falla", () => {
      const bad = vi.fn(() => { throw new Error("boom") })
      const good = vi.fn()
      onScrollModeChange(bad)
      onScrollModeChange(good)
      expect(() => setScrollMode({ goToPage: () => {} })).not.toThrow()
      expect(good).toHaveBeenCalledWith(true)
    })
  })
})
