import { setScrollMode }           from "../../shared/state/scrollModeState.js"
import { renderAnnotations } from "../annotations/renderer.js"
import { renderSearchAnnotations } from "../search/engine.js"

const PAGE_STORAGE_KEY = "pdf_last_page"

export function initScrollMode({ url, getCurrentPage }) {
  const btn = document.querySelector(".toolbar__button--scroll-mode")
  if (!btn) return

  let isScroll    = false
  let observer    = null
  let pageTracker = null
  let pdfDoc      = null
  let scale       = 1.5

  btn.addEventListener("click", () => {
    isScroll = !isScroll
    btn.classList.toggle("toolbar__button--active", isScroll)
    if (isScroll) enterScrollMode()
    else exitScrollMode()
  })

  async function enterScrollMode() {
    const pdfjsLib  = window["pdfjs-dist/build/pdf"]
    pdfDoc          = await pdfjsLib.getDocument(url).promise
    const pageInput = document.querySelector(".toolbar__input--page")
    const startPage = parseInt(pageInput?.value) || getCurrentPage()

    document.getElementById("viewer").style.display = "none"

    const container = document.createElement("div")
    container.id = "scroll-container"
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      width: 100%;
      box-sizing: border-box;
    `

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const wrapper = document.createElement("div")
      wrapper.dataset.page = i
      wrapper.id = `scroll-page-${i}`
      wrapper.style.cssText = `
        position: relative;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        width: 816px;
        height: 1056px;
      `
      // Fix shift: PDF.js usa --scale-factor para posicionar los spans del
      // textLayer. Sin esto los spans quedan desplazados respecto a donde
      // getBoundingClientRect los busca al renderizar anotaciones.
      wrapper.style.setProperty("--scale-factor", scale)
      container.appendChild(wrapper)
    }

    document.querySelector(".pdfviewer").appendChild(container)
    setScrollMode({ zoomIn, zoomOut, goToPage })
    setupObserver(container)
    migrateImagesToScroll()

    requestAnimationFrame(() => {
      const target = document.getElementById(`scroll-page-${startPage}`)
      if (target) target.scrollIntoView({ behavior: "instant" })

      requestAnimationFrame(() => {
        setupPageTracker(container)
      })
    })
  }

  function setupPageTracker(container) {
    if (pageTracker) pageTracker.disconnect()

    const pageInput = document.querySelector(".toolbar__input--page")

    pageTracker = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const page = parseInt(entry.target.dataset.page)
          if (pageInput && document.activeElement !== pageInput) {
            pageInput.value = page
          }
          localStorage.setItem(PAGE_STORAGE_KEY, page)
        }
      })
    }, { threshold: 0.5 })

    container.querySelectorAll("[data-page]").forEach(w => pageTracker.observe(w))
  }

  function setupObserver(container) {
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const wrapper = entry.target
        if (wrapper.dataset.rendered === String(scale)) continue
        wrapper.dataset.rendered = String(scale)
        observer.unobserve(wrapper)
        await renderWrapper(wrapper)
        const page = parseInt(wrapper.dataset.page)
        renderAnnotations(document.getElementById("viewer"), page)
        renderSearchAnnotations()
      }
    }, { rootMargin: "200px" })

    container.querySelectorAll("[data-page]").forEach(w => observer.observe(w))
  }

  async function renderWrapper(wrapper) {
    const pdfjsLib = window["pdfjs-dist/build/pdf"]
    const pageNum  = parseInt(wrapper.dataset.page)
    const page     = await pdfDoc.getPage(pageNum)
    const viewport = page.getViewport({ scale })

    const savedImages = Array.from(wrapper.querySelectorAll(".annotation-image"))

    wrapper.style.width  = viewport.width  + "px"
    wrapper.style.height = viewport.height + "px"
    // Actualizar --scale-factor al re-renderizar (por cambios de zoom)
    wrapper.style.setProperty("--scale-factor", scale)
    wrapper.innerHTML = ""

    const canvas  = document.createElement("canvas")
    canvas.width  = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise

    const textLayer = document.createElement("div")
    textLayer.className = "textLayer"
    textLayer.style.cssText = `
      position: absolute;
      left: 0; top: 0;
      width: ${viewport.width}px;
      height: ${viewport.height}px;
      pointer-events: auto;
      user-select: text;
    `

    const textContent = await page.getTextContent()
    await pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container: textLayer,
      viewport
    }).promise

    wrapper.appendChild(canvas)
    wrapper.appendChild(textLayer)

    for (const img of savedImages) wrapper.appendChild(img)
  }

  async function rerenderAll() {
    const container = document.getElementById("scroll-container")
    if (!container) return

    // Actualizar --scale-factor en todos los wrappers al hacer zoom
    container.querySelectorAll("[data-page]").forEach(w => {
      w.dataset.rendered = ""
      w.style.setProperty("--scale-factor", scale)
    })

    setupObserver(container)
    setupPageTracker(container)
  }

  function zoomIn()  { scale = Math.min(scale + 0.25, 4.0); rerenderAll() }
  function zoomOut() { scale = Math.max(scale - 0.25, 0.5); rerenderAll() }

  function goToPage(page) {
    const target = document.getElementById(`scroll-page-${page}`)
    if (target) target.scrollIntoView({ behavior: "smooth" })
  }

  function getVisiblePage() {
    const pageInput = document.querySelector(".toolbar__input--page")
    const page      = parseInt(pageInput?.value)
    return Number.isNaN(page) ? getCurrentPage() : page
  }

  function exitScrollMode() {
    if (observer)    { observer.disconnect();    observer    = null }
    if (pageTracker) { pageTracker.disconnect(); pageTracker = null }

    const visiblePage = getVisiblePage()

    migrateImagesToViewer()

    const container = document.getElementById("scroll-container")
    if (container) container.remove()

    document.getElementById("viewer").style.display = ""
    setScrollMode(null)

    const pageInput = document.querySelector(".toolbar__input--page")
    if (pageInput) pageInput.value = visiblePage

    const pdfjsLib = window["pdfjs-dist/build/pdf"]
    pdfjsLib.getDocument(url).promise.then(async doc => {
      const page      = await doc.getPage(visiblePage)
      const viewport  = page.getViewport({ scale: 1.5 })
      const canvas    = document.getElementById("pdf-canvas")
      const viewer    = document.getElementById("viewer")
      const textLayer = document.getElementById("text-layer")

      canvas.width  = viewport.width
      canvas.height = viewport.height
      viewer.style.width  = viewport.width  + "px"
      viewer.style.height = viewport.height + "px"

      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise

      const textContent = await page.getTextContent()
      textLayer.innerHTML = ""
      await pdfjsLib.renderTextLayer({
        textContentSource: textContent,
        container: textLayer,
        viewport
      }).promise

      renderAnnotations(viewer, visiblePage)
      renderSearchAnnotations(visiblePage)
    })
  }
}

function migrateImagesToScroll() {
  const viewer = document.getElementById("viewer")
  if (!viewer) return

  for (const img of Array.from(viewer.querySelectorAll(".annotation-image"))) {
    const page    = parseInt(img.dataset.page) || 1
    const wrapper = document.getElementById(`scroll-page-${page}`)
    if (wrapper) wrapper.appendChild(img)
  }
}

function migrateImagesToViewer() {
  const viewer    = document.getElementById("viewer")
  const container = document.getElementById("scroll-container")
  if (!viewer || !container) return

  for (const img of Array.from(container.querySelectorAll(".annotation-image"))) {
    viewer.appendChild(img)
  }
}