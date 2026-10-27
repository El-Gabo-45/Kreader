import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initSearch } from "../../../features/search/searchController.js"
import * as searchEngine from "../../../features/search/engine.js"
import { viewerState } from "../../../shared/state/viewerState.js"

describe("searchController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    viewerState.tool = null
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  function setup() {
    const input = document.createElement("input")
    input.className = "toolbar__popup__search-input"
    const nextBtn = document.createElement("button")
    nextBtn.className = "toolbar__popup__search-button--next"
    const prevBtn = document.createElement("button")
    prevBtn.className = "toolbar__popup__search-button--prev"
    const hlBtn = document.createElement("button")
    hlBtn.className = "toolbar__popup__search-button--highlight"
    const ulBtn = document.createElement("button")
    ulBtn.className = "toolbar__popup__search-button--underline"
    document.body.appendChild(input)
    document.body.appendChild(nextBtn)
    document.body.appendChild(prevBtn)
    document.body.appendChild(hlBtn)
    document.body.appendChild(ulBtn)
    return { input, nextBtn, prevBtn, hlBtn, ulBtn }
  }

  it("no hace nada si no hay input de búsqueda", () => {
    document.body.innerHTML = ""
    expect(() => initSearch({ textLayer: document.createElement("div") })).not.toThrow()
  })

  it("Enter en el input llama a searchWords", () => {
    const spy = vi.spyOn(searchEngine, "searchWords")
    const { input } = setup()
    initSearch({ textLayer: document.createElement("div") })

    input.value = "prueba"
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
    expect(spy).toHaveBeenCalledWith(
      { container: expect.anything(), word: "prueba" }
    )
  })

  it("next/prev llaman a searchNext/searchPrev", () => {
    const nextSpy = vi.spyOn(searchEngine, "searchNext")
    const prevSpy = vi.spyOn(searchEngine, "searchPrev")
    const { nextBtn, prevBtn } = setup()
    initSearch({ textLayer: document.createElement("div") })

    nextBtn.click()
    expect(nextSpy).toHaveBeenCalled()
    prevBtn.click()
    expect(prevSpy).toHaveBeenCalled()
  })

  it("highlight setea tool='highlight' y llama highlightMatches", () => {
    const hmSpy = vi.spyOn(searchEngine, "highlightMatches")
    const { hlBtn } = setup()
    initSearch({ textLayer: document.createElement("div") })

    hlBtn.click()
    expect(viewerState.tool).toBe("highlight")
    expect(hmSpy).toHaveBeenCalledWith({ color: expect.any(String), word: undefined })
    expect(viewerState.tool).toBe(null) // se resetea tras llamar
  })

  it("underline setea tool='underline' y llama underlineMatches", () => {
    const umSpy = vi.spyOn(searchEngine, "underlineMatches")
    const { ulBtn } = setup()
    initSearch({ textLayer: document.createElement("div") })

    ulBtn.click()
    expect(viewerState.tool).toBe("underline")
    expect(umSpy).toHaveBeenCalledWith({ color: expect.any(String), word: undefined })
    expect(viewerState.tool).toBe(null)
  })
})
