import { describe, it, expect, beforeEach } from "vitest"
import {
  state,
  getCurrentPageFn,
  setCurrentPageGetter,
  setOverlayContainer
} from "../../../state.js"

describe("search state", () => {
  beforeEach(() => {
    state.matches = []
    state.currentIndex = -1
    state.overlays = []
    state.container = document.body
  })

  it("estado inicial", () => {
    expect(state.matches).toEqual([])
    expect(state.currentIndex).toBe(-1)
    expect(state.overlays).toEqual([])
  })

  describe("setCurrentPageGetter", () => {
    it("guarda el getter y getCurrentPageFn lo devuelve", () => {
      const fn = () => 5
      setCurrentPageGetter(fn)
      expect(getCurrentPageFn()).toBe(5)
    })

    it("ignora valores que no son funciones", () => {
      const original = getCurrentPageFn()
      setCurrentPageGetter(null)
      setCurrentPageGetter("no-funcion")
      expect(getCurrentPageFn()).toBe(original)
    })
  })

  describe("setOverlayContainer", () => {
    it("cambia el contenedor si es un HTMLElement", () => {
      const div = document.createElement("div")
      setOverlayContainer(div)
      expect(state.container).toBe(div)
    })

    it("ignora valores que no son HTMLElement", () => {
      setOverlayContainer(null)
      setOverlayContainer("no-elemento")
      expect(state.container).toBe(document.body)
    })
  })
})
