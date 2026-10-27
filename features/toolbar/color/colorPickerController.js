import { setColor }                                        from "../../../shared/state/viewerState.js"
import { mapInputsToContainers, confirmCustomColor,
         applyInputColor }                                 from "./customColorManager.js"

const DEFAULT_COLOR = "#000000"

export function createColorPickerController({ inputs }) {
  const containerMap = mapInputsToContainers(inputs)

  let activeInput  = null
  let pendingColor = null

  initInputs(inputs)
  initColoris()
  initGlobalEvents()

  function initInputs(inputs) {
    inputs.forEach(input => {
      input.addEventListener("click", () => { activeInput = input })
      applyInputColor(input, DEFAULT_COLOR)
    })
  }

  function initColoris() {
    Coloris({
      el:            ".toolbar__popup__customcolor-input",
      theme:         "pill",
      themeMode:     "light",
      alpha:         false,
      wrap:          false,
      format:        "hex",
      formatToggle:  false,
      clearButton:   false,
      closeButton:   true,
      closeLabel:    "OK",
      defaultColor:  DEFAULT_COLOR,
      onChange:      handleColorChange
    })
  }

  function initGlobalEvents() {
    document.addEventListener("click",   handleDocumentClick)
    document.addEventListener("keydown", handleKeydown)
  }

  function handleColorChange(color, input) {
    pendingColor = color
    applyInputColor(input, color)
    setColor(color)
  }

  function handleDocumentClick(e) {
    if (e.target.matches("#clr-close")) confirm()
  }

  function handleKeydown(e) {
    if (e.key === "Enter" && activeInput) confirm()
  }

  function confirm() {
    confirmCustomColor(activeInput, pendingColor, containerMap)
    pendingColor = null
  }
}