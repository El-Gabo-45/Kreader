/* Entorno jsdom + stubs de APIs del navegador que faltan en jsdom
   (pdf.js worker, Coloris, IntersectionObserver, matchMedia, scrollIntoView, etc.) */

// --- matchMedia ---
window.matchMedia = window.matchMedia || function () {
  return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }
}

// --- IntersectionObserver (no-op: dispara callback como intersectando) ---
window.IntersectionObserver = class IntersectionObserver {
  constructor (cb) { this.cb = cb }
  observe () {}
  unobserve () {}
  disconnect () {}
  takeRecords () { return [] }
}

// --- scrollIntoView no-op ---
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function () {}

// --- getClientRects / getBoundingClientRect por defecto ---
Element.prototype.getBoundingClientRect = Element.prototype.getBoundingClientRect || function () {
  return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} }
}
Element.prototype.getClientRects = Element.prototype.getClientRects || function () {
  return []
}

// --- Stubs de pdf.js (window["pdfjs-dist/build/pdf"]) ---
const pdfjsStubs = {
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: async () => ({
    promise: {
      numPages: 3,
      getPage: async (n) => ({
        getViewport: () => ({ width: 800, height: 1000 }),
        render: () => ({ promise: Promise.resolve() }),
        getTextContent: async () => ({ items: [] })
      })
    }
  }),
  renderTextLayer: () => ({ promise: Promise.resolve() })
}
window["pdfjs-dist/build/pdf"] = pdfjsStubs

// --- Coloris global (si existe se respeta, si no, no-op) ---
if (typeof window.Coloris === "undefined") {
  window.Coloris = function () { return {} }
}

// --- localStorage en memoria ---
const localStorageStore = {}
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (k) => localStorageStore[k] || null,
    setItem: (k, v) => { localStorageStore[k] = String(v) },
    removeItem: (k) => { delete localStorageStore[k] },
    clear: () => { Object.keys(localStorageStore).forEach((k) => { delete localStorageStore[k] }) }
  },
  writable: false
})

// --- document.fonts (usado por pdf.js text layer) ---
if (!document.fonts) {
  document.fonts = { ready: Promise.resolve() }
}

// --- window.getSelection no-op ---
if (!window.getSelection) {
  window.getSelection = () => ({
    isCollapsed: true,
    rangeCount: 0,
    getRangeAt: () => ({}),
    removeAllRanges: () => {}
  })
}
