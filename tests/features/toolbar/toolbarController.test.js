import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { createToolbarController } from "../../../features/toolbar/toolbarController.js"
import { viewerState, setTool } from "../../../shared/state/viewerState.js"

describe("toolbarController", () => {
  let highlightBtn, underlineBtn

  beforeEach(() => {
    document.body.innerHTML = ""
    viewerState.tool = null

    highlightBtn = document.createElement("button")
    highlightBtn.className = "toolbar__button--highlight"
    underlineBtn = document.createElement("button")
    underlineBtn.className = "toolbar__button--underline"

    const grab = document.createElement("button")
    grab.className = "toolbar__button--grab"
    const signature = document.createElement("button")
    signature.className = "toolbar__button--signature"

    document.body.appendChild(highlightBtn)
    document.body.appendChild(underlineBtn)
    document.body.appendChild(grab)
    document.body.appendChild(signature)
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("activa highlight y desactiva underline al hacer clic", () => {
    createToolbarController({ highlightBtn, underlineBtn })
    highlightBtn.click()
    expect(viewerState.tool).toBe("highlight")
    expect(highlightBtn.classList.contains("toolbar__button--active")).toBe(true)
    expect(underlineBtn.classList.contains("toolbar__button--active")).toBe(false)
  })

  it("toggle: hacer clic dos veces desactiva", () => {
    createToolbarController({ highlightBtn, underlineBtn })
    highlightBtn.click()
    highlightBtn.click()
    expect(viewerState.tool).toBe(null)
    expect(highlightBtn.classList.contains("toolbar__button--active")).toBe(false)
  })

  it("activar underline desactiva highlight", () => {
    createToolbarController({ highlightBtn, underlineBtn })
    highlightBtn.click()
    underlineBtn.click()
    expect(viewerState.tool).toBe("underline")
    expect(highlightBtn.classList.contains("toolbar__button--active")).toBe(false)
    expect(underlineBtn.classList.contains("toolbar__button--active")).toBe(true)
  })

  it("click fuera de la barra desactiva todo (Escape también)", () => {
    createToolbarController({ highlightBtn, underlineBtn })
    highlightBtn.click()
    expect(viewerState.tool).toBe("highlight")

    const event = new MouseEvent("click", { bubbles: true })
    document.dispatchEvent(event)
    expect(viewerState.tool).toBe(null)

    // Escape
    setTool("highlight")
    const esc = new KeyboardEvent("keydown", { key: "Escape" })
    document.dispatchEvent(esc)
    expect(viewerState.tool).toBe(null)
  })

  it("click dentro de la barra no desactiva", () => {
    createToolbarController({ highlightBtn, underlineBtn })
    highlightBtn.click()
    const internal = new MouseEvent("click", { bubbles: true })
    highlightBtn.dispatchEvent(internal) // stopPropagation lo impide
    // De todas formas el listener global no debería desactivar porque está dentro del toolbar
    // (el test verifica que no explote)
    expect(viewerState.tool).toBe("highlight")
  })
})
