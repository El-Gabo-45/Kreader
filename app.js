import { setOverlayContainer, setCurrentPageGetter } from "./features/search/engine.js"
import { createToolbarController }     from "./features/toolbar/toolbarController.js"
import { createColorPickerController } from "./features/toolbar/color/colorPickerController.js"
import { initPopups }                  from "./features/toolbar/popupController.js"
import { initZoom }                    from "./features/viewer/zoomController.js"
import { initPageController }          from "./features/pdf/pageController.js"
import { initRotation }                from "./features/viewer/rotationController.js"
import { initColorSelection }          from "./features/toolbar/color/colorSelectionController.js"
import { initSelection }               from "./features/annotations/index.js"
import { initSearch }                  from "./features/search/searchController.js"
import { initTheme }                   from "./features/viewer/themeController.js"
import { initAddImage }                from "./features/media/addImageController.js"
import { initPresentation }            from "./features/viewer/presentationController.js"
import { initThickness }               from "./features/annotations/thicknessController.js"
import { initScrollMode }              from "./features/pdf/scrollModeController.js"
import { initGrab }                    from "./features/viewer/grabController.js"

function initFilename(url) {
  const input = document.querySelector(".toolbar__input--filename")
  if (!input || !url) return
  input.value = url.split("/").pop().replace(".pdf", "").replaceAll("-", " ").trim()
}

export async function initApp({ dom, pdf, url }) {
  initFilename(url)
  setOverlayContainer(dom.viewer)
  setCurrentPageGetter(pdf.getCurrentPage)

  createToolbarController(dom.toolbar)
  createColorPickerController({ inputs: dom.colorInputs })

  initSearch({ textLayer: dom.textLayer })
  initPopups()
  initZoom({ pdf })
  initPageController({ pdf, totalPages: pdf.totalPages })
  initRotation({ pdf })
  initColorSelection()
  initSelection({
    viewer:              dom.viewer,
    getCurrentPage:      pdf.getCurrentPage,
    getCurrentRotation:  pdf.getCurrentRotation
  })
  initAddImage({ viewer: dom.viewer })
  if (url) initPresentation({ pdf, url })
  initTheme()
  initThickness()
  if (url) initScrollMode({ url, getCurrentPage: pdf.getCurrentPage })
  initGrab()
}