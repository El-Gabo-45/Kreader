import { setThickness } from "../../shared/state/viewerState.js"

export function initThickness() {

  const configs = [
    { tool: "highlight", selector: ".toolbar__popup--highlight", defaultValue: 10 },
    { tool: "underline", selector: ".toolbar__popup--underline", defaultValue: 2 }
  ]

  configs.forEach(({ tool, selector, defaultValue }) => {
    document
      .querySelectorAll(`${selector} .toolbar__popup__thickness-input`)
      .forEach(input => {
        input.value = defaultValue

        input.addEventListener("input", () => {
          const value = Number(input.value)
          setThickness(tool, value)
        })
      })
  })
}