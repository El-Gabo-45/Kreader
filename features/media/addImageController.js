import { isScrollMode, getScrollMode } from "../../shared/state/scrollModeState.js"

const INITIAL_POSITION = { x: 100, y: 100 }
const MIN_WIDTH = 50

export function initAddImage({ viewer }) {
  const input  = document.querySelector(".toolbar__popup__addimage-input")
  const button = document.querySelector(".toolbar__popup__addimage-btn")

  if (!input) return

  button?.addEventListener("click", () => input.click())
  input.addEventListener("change", () => handleImageUpload(input, viewer))
}

function handleImageUpload(input, viewer) {
  const file = input.files?.[0]
  if (!file) return

  const page   = getCurrentPageNumber()
  const target = getTarget(viewer)
  if (!target) return

  const imageElement = createImageElement(file)
  const wrapper      = createImageWrapper(page)

  wrapper.appendChild(imageElement)
  target.appendChild(wrapper)

  makeAnnotationImage(wrapper)

  input.value = ""
  closeAddImagePopup()
}

function getCurrentPageNumber() {
  const input = document.querySelector(".toolbar__input--page")
  return parseInt(input?.value) || 1
}

function getTarget(viewer) {
  if (isScrollMode()) {
    const page    = getCurrentPageNumber()
    const wrapper = document.getElementById(`scroll-page-${page}`)
    return wrapper || null
  }
  return viewer
}

function createImageElement(file) {
  const url = URL.createObjectURL(file)
  const img = document.createElement("img")
  img.src = url
  img.style.width = "100%"
  img.style.height = "100%"
  img.style.display = "block"
  img.style.pointerEvents = "none"
  return img
}

// Guardar la página en data-page para poder migrar la imagen al cambiar de modo
function createImageWrapper(page) {
  const wrapper = document.createElement("div")
  wrapper.className        = "annotation-image"
  wrapper.dataset.page     = page
  wrapper.style.position   = "absolute"
  wrapper.style.left       = `${INITIAL_POSITION.x}px`
  wrapper.style.top        = `${INITIAL_POSITION.y}px`
  wrapper.style.width      = "200px"
  wrapper.style.cursor     = "move"
  wrapper.style.zIndex     = "20"
  wrapper.style.boxSizing  = "border-box"
  return wrapper
}

function closeAddImagePopup() {
  document.querySelector(".toolbar__popup--addimage")
    ?.classList.remove("toolbar__popup--visible")
}

function makeAnnotationImage(element) {
  let selected = false

  initDrag(element)

  element.addEventListener("dblclick", e => {
    e.stopPropagation()
    selected = !selected
    toggleHandles(element, selected)
  })

  document.addEventListener("click", e => {
    if (!element.contains(e.target) && selected) {
      selected = false
      toggleHandles(element, false)
    }
  })

  document.addEventListener("keydown", e => {
    if (e.key === "Delete" && selected) element.remove()
  })
}

function initDrag(element) {
  element.addEventListener("mousedown", e => {
    if (e.target.classList.contains("resize-handle")) return
    e.preventDefault()

    const startX    = e.clientX
    const startY    = e.clientY
    const startLeft = parseInt(element.style.left, 10)
    const startTop  = parseInt(element.style.top,  10)

    function onMove(e) {
      element.style.left = startLeft + (e.clientX - startX) + "px"
      element.style.top  = startTop  + (e.clientY - startY) + "px"
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup",   onUp)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup",   onUp)
  })
}

function toggleHandles(element, show) {
  removeHandles(element)
  element.style.outline = show ? "2px dashed #4760b3" : "none"
  if (!show) return

  const positions = [
    { right: "-6px", bottom: "-6px", cursor: "se-resize", dir: "se" },
    { left:  "-6px", bottom: "-6px", cursor: "sw-resize", dir: "sw" },
    { right: "-6px", top:    "-6px", cursor: "ne-resize", dir: "ne" },
    { left:  "-6px", top:    "-6px", cursor: "nw-resize", dir: "nw" }
  ]

  positions.forEach(pos => {
    const handle = createResizeHandle(pos)
    initResize(handle, element, pos.dir)
    element.appendChild(handle)
  })
}

function createResizeHandle({ right, left, top, bottom, cursor }) {
  const handle = document.createElement("div")
  handle.className = "resize-handle"
  handle.style.position     = "absolute"
  if (right)  handle.style.right  = right
  if (left)   handle.style.left   = left
  if (top)    handle.style.top    = top
  if (bottom) handle.style.bottom = bottom
  handle.style.width        = "12px"
  handle.style.height       = "12px"
  handle.style.background   = "#4760b3"
  handle.style.cursor       = cursor
  handle.style.borderRadius = "50%"
  handle.style.zIndex       = "21"
  return handle
}

function removeHandles(element) {
  element.querySelectorAll(".resize-handle").forEach(h => h.remove())
}

function initResize(handle, element, direction) {
  handle.addEventListener("mousedown", e => {
    e.preventDefault()
    e.stopPropagation()

    const startX     = e.clientX
    const startWidth = element.offsetWidth
    const startLeft  = parseInt(element.style.left, 10)

    function onMove(e) {
      const dx = e.clientX - startX
      if (direction === "se" || direction === "ne") {
        element.style.width = Math.max(MIN_WIDTH, startWidth + dx) + "px"
      } else {
        const newWidth = Math.max(MIN_WIDTH, startWidth - dx)
        element.style.width = newWidth + "px"
        element.style.left  = startLeft + startWidth - newWidth + "px"
      }
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup",   onUp)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup",   onUp)
  })
}