import { createDomMap }            from "./shared/dom/domMap.js"
import { createPdfRenderer }       from "./features/pdf/pdfRenderer.js"
import { renderAnnotations }       from "./features/annotations/index.js"
import { renderSearchAnnotations } from "./features/search/engine.js"
import { initApp }                 from "./app.js"
import { loadIcons }               from "./shared/dom/iconLoader.js"

document.addEventListener("DOMContentLoaded", async () => {
  await loadIcons()

  const dom = createDomMap()

  const fileInput = document.getElementById("pdf-file-input")
  const openBtn   = document.getElementById("pdf-open-btn")

  if (!fileInput || !openBtn) return

  openBtn.addEventListener("click", () => fileInput.click())

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)

    const pdf = await createPdfRenderer({
      canvas:         dom.canvas,
      textLayer:      dom.textLayer,
      viewer:         dom.viewer,
      url,
      onPageRendered: (page) => {
        renderAnnotations(dom.viewer, page)
        renderSearchAnnotations(page)
      }
    })

    initApp({ dom, pdf, url })
  })
})