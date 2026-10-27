import { createDomMap }            from "./shared/dom/domMap.js"
import { createPdfRenderer }       from "./features/pdf/pdfRenderer.js"
import { renderAnnotations }       from "./features/annotations/index.js"
import { renderSearchAnnotations } from "./features/search/engine.js"
import { initApp }                 from "./app.js"
import { loadIcons }               from "./shared/dom/iconLoader.js"

const PDF_URL = "./pdf-_matematicas_basicas-_completo-_09-15.pdf"

document.addEventListener("DOMContentLoaded", async () => {
  await loadIcons()

  const dom = createDomMap()

  const pdf = await createPdfRenderer({
    canvas:         dom.canvas,
    textLayer:      dom.textLayer,
    viewer:         dom.viewer,
    url:            PDF_URL,
    onPageRendered: (page) => {
      renderAnnotations(dom.viewer, page)
      renderSearchAnnotations(page)
    }
  })

  initApp({ dom, pdf, url: PDF_URL })
})