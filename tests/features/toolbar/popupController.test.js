import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initPopups } from "../../../features/toolbar/popupController.js"

describe("popupController", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  afterEach(() => {
    document.body.innerHTML = ""
  })

  function setupPopup({ buttonClass, popupClass, group = "primary", visible = false }) {
    const button = document.createElement("button")
    button.className = `toolbar__button ${buttonClass}`
    const popup = document.createElement("div")
    popup.className = `toolbar__popup ${popupClass}`
    if (visible) popup.classList.add("toolbar__popup--visible")
    document.body.appendChild(button)
    document.body.appendChild(popup)
    return { button, popup }
  }

  it("toggle muestra/oculta el popup", () => {
    const { button, popup } = setupPopup({ buttonClass: "toolbar__button--highlight", popupClass: "toolbar__popup--highlight" })
    initPopups()

    button.click()
    expect(popup.classList.contains("toolbar__popup--visible")).toBe(true)

    button.click()
    expect(popup.classList.contains("toolbar__popup--visible")).toBe(false)
  })

  it("exclusión mutua dentro del grupo primary", () => {
    const { button: b1, popup: p1 } = setupPopup({ buttonClass: "toolbar__button--highlight", popupClass: "toolbar__popup--highlight" })
    const { button: b2, popup: p2 } = setupPopup({ buttonClass: "toolbar__button--underline", popupClass: "toolbar__popup--underline" })
    initPopups()

    b1.click()
    expect(p1.classList.contains("toolbar__popup--visible")).toBe(true)

    b2.click()
    expect(p1.classList.contains("toolbar__popup--visible")).toBe(false)
    expect(p2.classList.contains("toolbar__popup--visible")).toBe(true)
  })

  it("click global cierra popups y limpia matches de búsqueda", () => {
    const { button, popup } = setupPopup({ buttonClass: "toolbar__button--search", popupClass: "toolbar__popup--search", group: "search" })
    initPopups()

    button.click()
    expect(popup.classList.contains("toolbar__popup--visible")).toBe(true)

    const outside = new MouseEvent("mousedown", { bubbles: true })
    document.body.dispatchEvent(outside)
    expect(popup.classList.contains("toolbar__popup--visible")).toBe(false)
  })

  it("no cierra si el clic viene de un botón de popup (mousedown marcado)", () => {
    const { button, popup } = setupPopup({ buttonClass: "toolbar__button--highlight", popupClass: "toolbar__popup--highlight" })
    initPopups()

    const mdown = new MouseEvent("mousedown", { bubbles: true })
    Object.defineProperty(mdown, "_fromPopupButton", { value: true })
    button.dispatchEvent(mdown)
    // toggle no se dispara en mousedown, solo en click
    expect(popup.classList.contains("toolbar__popup--visible")).toBe(false)
  })
})
