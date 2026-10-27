const ACTIVE_CLASS  = "toolbar__button--active"
const GRAB_CLASS    = "pdfviewer--grabbing"

export function initGrab() {
  const btn = document.querySelector(".toolbar__button--grab")
  if (!btn) return

  let isActive  = false
  let cleanup   = null

  btn.addEventListener("click", () => {
    isActive = !isActive
    btn.classList.toggle(ACTIVE_CLASS, isActive)

    if (isActive) {
      cleanup = enableGrab()
    } else {
      cleanup?.()
      cleanup = null
    }
  })
}

function enableGrab() {
  const pdfviewer = document.querySelector(".pdfviewer")
  if (!pdfviewer) return () => {}

  pdfviewer.style.cursor = "grab"

  let isDragging = false
  let startX     = 0
  let startY     = 0
  let scrollLeft = 0
  let scrollTop  = 0

  function getScrollTarget() {
    // En scroll mode el contenedor scrollable es .pdfviewer,
    // en modo normal también, así que siempre usamos el mismo
    return pdfviewer
  }

  function onMouseDown(e) {
    // Ignorar clicks en botones, inputs y popups
    if (e.target.closest(".toolbar"))         return
    if (e.target.closest(".toolbar__popup"))  return
    if (e.target.closest("button"))           return
    if (e.target.closest("input"))            return

    isDragging = true
    startX     = e.clientX
    startY     = e.clientY

    const target   = getScrollTarget()
    scrollLeft     = target.scrollLeft
    scrollTop      = target.scrollTop

    pdfviewer.style.cursor = "grabbing"
    e.preventDefault()
  }

  function onMouseMove(e) {
    if (!isDragging) return

    const dx     = e.clientX - startX
    const dy     = e.clientY - startY
    const target = getScrollTarget()

    target.scrollLeft = scrollLeft - dx
    target.scrollTop  = scrollTop  - dy
  }

  function onMouseUp() {
    if (!isDragging) return
    isDragging             = false
    pdfviewer.style.cursor = "grab"
  }

  function onMouseLeave() {
    if (isDragging) onMouseUp()
  }

  pdfviewer.addEventListener("mousedown",  onMouseDown)
  window.addEventListener("mousemove",     onMouseMove)
  window.addEventListener("mouseup",       onMouseUp)
  pdfviewer.addEventListener("mouseleave", onMouseLeave)

  // Devolver función de limpieza para cuando se desactiva
  return function cleanup() {
    pdfviewer.removeEventListener("mousedown",  onMouseDown)
    window.removeEventListener("mousemove",     onMouseMove)
    window.removeEventListener("mouseup",       onMouseUp)
    pdfviewer.removeEventListener("mouseleave", onMouseLeave)
    pdfviewer.style.cursor = ""
  }
}