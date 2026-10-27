import { clearMatches } from "../search/engine.js"

const POPUP_VISIBLE_CLASS = "toolbar__popup--visible"
const POPUP_SELECTOR      = ".toolbar__popup"

const MUTUAL_EXCLUSION_GROUPS = {
  text: [
    ".toolbar__popup--highlight",
    ".toolbar__popup--underline"
  ],
  primary: [
    ".toolbar__popup--highlight",
    ".toolbar__popup--underline",
    ".toolbar__popup--addimage",
    ".toolbar__popup--signature"
  ]
}

const POPUP_CONFIG = [
  { button: ".toolbar__button--highlight", popup: ".toolbar__popup--highlight", group: "primary" },
  { button: ".toolbar__button--underline", popup: ".toolbar__popup--underline", group: "primary" },
  { button: ".toolbar__button--search",    popup: ".toolbar__popup--search",    group: "search"  },
  { button: ".toolbar__button--addimage",  popup: ".toolbar__popup--addimage",  group: "primary" },
  { button: ".toolbar__button--signature", popup: ".toolbar__popup--signature", group: "primary" }
]

export function initPopups() {
  const colorisGuard = createColorisGuard()
  const shouldClose  = createShouldClose(colorisGuard)

  const registry = buildPopupRegistry()
  const popupMap = createPopupMap(registry)

  initPopupButtons(registry, popupMap)
  initGlobalCloseHandler(shouldClose, popupMap)
}

function buildPopupRegistry() {
  return POPUP_CONFIG.map(config => {
    const button = document.querySelector(config.button)
    const popup  = document.querySelector(config.popup)
    if (!button || !popup) return null
    return { ...config, button, popup }
  }).filter(Boolean)
}

function createPopupMap(registry) {
  const map = new Map()
  registry.forEach(({ popup }) => map.set(popup, true))
  return map
}

function initPopupButtons(registry, popupMap) {
  registry.forEach(({ button, popup, group }) => {
    // En mousedown marcamos el evento para que el handler global lo ignore
    button.addEventListener("mousedown", (e) => {
      e._fromPopupButton = true
    })

    button.addEventListener("click", (e) => {
      e.stopPropagation()
      togglePopup(popup, group, popupMap)
      button.blur()
    })
  })
}

function togglePopup(popup, group, popupMap) {
  const isOpen = popup.classList.contains(POPUP_VISIBLE_CLASS)
  closeMutualExclusions(group, popup, popupMap)
  popup.classList.toggle(POPUP_VISIBLE_CLASS, !isOpen)
}

function closeMutualExclusions(group, exceptPopup, popupMap) {
  const selectors = MUTUAL_EXCLUSION_GROUPS[group]
  if (!selectors) return

  selectors.forEach(selector => {
    const popup = document.querySelector(selector)
    if (popup && popup !== exceptPopup) {
      popup.classList.remove(POPUP_VISIBLE_CLASS)
    }
  })
}

function initGlobalCloseHandler(shouldClose, popupMap) {
  document.addEventListener("mousedown", (event) => {
    // Si el mousedown viene de un botón de popup, lo ignora —
    // el click handler del botón se encarga del toggle
    if (event._fromPopupButton) return
    if (!shouldClose(event)) return

    closeAllPopups(popupMap)
    document.activeElement?.blur()
    clearMatches()
  })
}

function closeAllPopups(popupMap) {
  for (const popup of popupMap.keys()) {
    popup.classList.remove(POPUP_VISIBLE_CLASS)
  }
}

function createColorisGuard() {
  if (typeof Coloris === "undefined") {
    return { isOpen: () => false }
  }

  let open = false

  document.addEventListener("coloris:open",  () => { open = true  })
  document.addEventListener("coloris:close", () => { open = false })

  return { isOpen: () => open }
}

function createShouldClose(colorisGuard) {
  return (event) => {
    if (colorisGuard.isOpen())                                      return false
    if (event.target.closest(".clr-picker"))                        return false
    if (event.target.closest(POPUP_SELECTOR))                       return false
    if (event.target.closest(".toolbar__popup__customcolor-input")) return false

    return true
  }
}