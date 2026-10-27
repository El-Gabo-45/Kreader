import { annotations }   from "./state.js"
import { createOverlay } from "./overlays.js"
import { isScrollMode }  from "../../shared/state/scrollModeState.js"

const TEXT_SPAN_SELECTOR  = ".textLayer span"
const TEXT_LAYER_SELECTOR = ".textLayer"
const ANNOTATION_CLASS    = "annotation-overlay"
const SCROLL_CONTAINER_ID = "scroll-container"

export function renderAnnotations(viewer, currentPage) {
  if (isScrollMode()) renderScroll()
  else                renderSingle(viewer, currentPage)
}

function renderSingle(viewer, currentPage) {
  const textLayer = viewer.querySelector(TEXT_LAYER_SELECTOR)
  if (!textLayer) return

  clearAnnotations(textLayer)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      renderLayer(textLayer, annotations.filter(a => a.page === currentPage))
    })
  })
}

function renderScroll() {
  const container = document.getElementById(SCROLL_CONTAINER_ID)
  if (!container) return

  clearAnnotations(container)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const [page, anns] of Object.entries(groupByPage(annotations))) {
        const wrapper   = document.getElementById(`scroll-page-${page}`)
        const textLayer = wrapper?.querySelector(TEXT_LAYER_SELECTOR)
        if (textLayer) renderLayer(textLayer, anns)
      }
    })
  })
}

function renderLayer(textLayer, anns) {
  const spans     = Array.from(textLayer.querySelectorAll(TEXT_SPAN_SELECTOR))
  const layerRect = textLayer.getBoundingClientRect()

  for (const ann of anns) {
    const span = spans[ann.spanIndex]
    if (!span?.firstChild || span.firstChild.nodeType !== Node.TEXT_NODE) continue
    if (ann.endOffset > span.firstChild.length) continue

    const range = document.createRange()
    range.setStart(span.firstChild, ann.startOffset)
    range.setEnd(span.firstChild,   ann.endOffset)

    for (const rect of range.getClientRects()) {
      if (rect.width < 1) continue

      // Calcular posición relativa al textLayer
      let left   = rect.left   - layerRect.left
      let top    = rect.top    - layerRect.top
      let width  = rect.width
      let height = rect.height

      // Corregir coordenadas según la rotación guardada en la anotación
      // getClientRects() devuelve el bounding box en pantalla, que con rotación
      // 90°/270° tiene width y height intercambiados respecto al espacio del textLayer
      const rotation = ann.rotation ?? 0

      if (rotation === 90) {
        // El texto rotado 90°: en pantalla el span es alto y angosto
        // pero en el espacio del textLayer es ancho y bajo
        const tmp = width
        width  = height
        height = tmp
        // Corregir posición: el origen también rota
        const tmpPos = left
        left = layerRect.height - top - width
        top  = tmpPos
      } else if (rotation === 270) {
        const tmp = width
        width  = height
        height = tmp
        const tmpPos = top
        top  = layerRect.width - left - height
        left = tmpPos
      } else if (rotation === 180) {
        left = layerRect.width  - left - width
        top  = layerRect.height - top  - height
      }

      textLayer.appendChild(createOverlay(
        { left, top, width, height },
        ann
      ))
    }
  }
}

function clearAnnotations(container) {
  container.querySelectorAll(`.${ANNOTATION_CLASS}`).forEach(el => el.remove())
}

function groupByPage(list) {
  return list.reduce((map, ann) => {
    ;(map[ann.page] ??= []).push(ann)
    return map
  }, {})
}