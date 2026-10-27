export async function createPdfRenderer({ canvas, textLayer, viewer, url, onPageRendered }) {

  const pdfjsLib = window["pdfjs-dist/build/pdf"]

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

  const pdfDoc = await pdfjsLib.getDocument(url).promise

  let scale       = 1.5
  let currentPage = 1
  let rotation    = 0

  const MIN_SCALE  = 0.5
  const MAX_SCALE  = 4.0
  const SCALE_STEP = 0.25

  async function renderPage(pageNumber, animate = false) {
    currentPage = pageNumber

    textLayer.querySelectorAll(".search-overlay, .search-overlay--active").forEach(o => o.remove())
    window.getSelection()?.removeAllRanges()

    if (animate) {
      canvas.style.transition = "opacity 0.15s ease, transform 0.2s ease"
      canvas.style.opacity    = "0"
      canvas.style.transform  = "scale(0.95)"
    } else {
      canvas.style.transition = "opacity 0.2s ease"
      canvas.style.opacity    = "0"
    }

    await new Promise(r => setTimeout(r, animate ? 150 : 50))

    const page     = await pdfDoc.getPage(pageNumber)
    const viewport = page.getViewport({ scale, rotation })

    canvas.width  = viewport.width
    canvas.height = viewport.height

    viewer.style.width  = viewport.width  + "px"
    viewer.style.height = viewport.height + "px"
    viewer.style.setProperty("--scale-factor", scale)

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise

    canvas.style.transform = "scale(1)"
    canvas.style.opacity   = "1"

    const textContent = await page.getTextContent()
    textLayer.innerHTML = ""

    textLayer.style.width  = viewport.width  + "px"
    textLayer.style.height = viewport.height + "px"

    await pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container: textLayer,
      viewport
    }).promise

    if (onPageRendered) onPageRendered(currentPage)
  }

  function zoomIn() {
    if (scale >= MAX_SCALE) return
    scale = Math.min(scale + SCALE_STEP, MAX_SCALE)
    renderPage(currentPage)
  }

  function zoomOut() {
    if (scale <= MIN_SCALE) return
    scale = Math.max(scale - SCALE_STEP, MIN_SCALE)
    renderPage(currentPage)
  }

  function rotateLeft() {
    rotation = (rotation - 90 + 360) % 360
    renderPage(currentPage, true)
  }

  function rotateRight() {
    rotation = (rotation + 90) % 360
    renderPage(currentPage, true)
  }

  function flip() {
    rotation = (rotation + 180) % 360
    renderPage(currentPage, true)
  }

  return {
    renderPage,
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
    flip,
    totalPages:         pdfDoc.numPages,
    getCurrentPage:     () => currentPage,
    getCurrentRotation: () => rotation
  }
}