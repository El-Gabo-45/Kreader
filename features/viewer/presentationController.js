import { isScrollMode } from "../../shared/state/scrollModeState.js"

let presentationOverlay = null
let pdfDoc = null

export function initPresentation({ pdf, url }) {
  const elements = getElements()
  if (!elements.button) return

  const state = { isActive: false, currentPage: 1 }

  presentationOverlay = createOverlay()
  document.body.appendChild(presentationOverlay)

  const pdfjsLib = window["pdfjs-dist/build/pdf"]
  pdfjsLib.getDocument(url).promise.then(doc => { pdfDoc = doc })

  initEvents(elements, state, pdf)
}

function createOverlay() {
  const div = document.createElement("div")
  div.id = "presentation-overlay"
  div.style.cssText = `
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: black;
    z-index: 9999;
    align-items: center;
    justify-content: center;
  `
  const canvas = document.createElement("canvas")
  canvas.id = "presentation-canvas"
  div.appendChild(canvas)
  return div
}

function getElements() {
  return {
    button:    document.querySelector(".toolbar__button--presentation"),
    viewer:    document.querySelector(".pdfviewer"),
    pdfViewer: document.getElementById("viewer"),
    toolbar:   document.querySelector(".toolbar"),
    pageInput: document.querySelector(".toolbar__input--page")
  }
}

function getVisiblePage() {
  if (!isScrollMode()) return null

  const container = document.querySelector(".pdfviewer")
  if (!container) return null

  const pages     = Array.from(document.querySelectorAll("[data-page]"))
  const containerRect = container.getBoundingClientRect()

  let bestPage    = 1
  let bestVisible = 0

  pages.forEach(page => {
    const rect    = page.getBoundingClientRect()
    const visible = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top)
    if (visible > bestVisible) {
      bestVisible = visible
      bestPage    = parseInt(page.dataset.page)
    }
  })

  return bestPage
}

function initEvents(elements, state, pdf) {
  elements.button.addEventListener("click", () => {
    if (state.isActive) {
      state.isActive = false
      exitPresentation(elements)
    } else {
      state.isActive    = true
      state.currentPage = isScrollMode() ? getVisiblePage() : getCurrentPage(elements)
      enterPresentation(elements, state)
    }
  })

  document.addEventListener("keydown", e => {
    if (!state.isActive) return

    if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
      e.preventDefault()
      goToPage(state.currentPage + 1, elements, state)
    }

    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      goToPage(state.currentPage - 1, elements, state)
    }

    if (e.key === "Escape") {
      state.isActive = false
      exitPresentation(elements)
    }
  })
}

async function goToPage(page, elements, state) {
  state.currentPage = page
  updatePageInput(elements, page)
  await renderToOverlay(page)
}

async function enterPresentation(elements, state) {
  elements.toolbar?.classList.add("toolbar--hidden")
  presentationOverlay.style.display = "flex"
  await renderToOverlay(state.currentPage)
}

function exitPresentation(elements) {
  elements.toolbar?.classList.remove("toolbar--hidden")
  presentationOverlay.style.display = "none"
}

async function renderToOverlay(pageNumber) {
  if (!pdfDoc) return

  const page     = await pdfDoc.getPage(pageNumber)
  const scale    = 1.5
  const viewport = page.getViewport({ scale })

  const dst = document.getElementById("presentation-canvas")
  if (!dst) return

  dst.width  = viewport.width
  dst.height = viewport.height

  await page.render({
    canvasContext: dst.getContext("2d"),
    viewport
  }).promise

  const fitScale = Math.min(
    window.innerWidth  / viewport.width,
    window.innerHeight / viewport.height
  ) * 0.95

  dst.style.transformOrigin = "center center"
  dst.style.transform       = `scale(${fitScale})`
}

function getCurrentPage({ pageInput }) {
  const value = Number(pageInput?.value)
  return Number.isNaN(value) ? 1 : value
}

function updatePageInput({ pageInput }, page) {
  if (pageInput) pageInput.value = page
}