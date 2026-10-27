/* Helpers para construir fixtures de DOM reutilizables en los tests */

export function makeDocument(html) {
  document.documentElement.innerHTML = html
  return document
}

// Crea un <span> del textLayer con un nodo de texto hijo (como pdf.js lo genera)
export function makeSpan(text, container) {
  const span = document.createElement("span")
  const textNode = document.createTextNode(text)
  span.appendChild(textNode)
  if (container) container.appendChild(span)
  return span
}

// Crea un textLayer con varios spans
export function makeTextLayer(spans = ["Hola mundo prueba"], parent) {
  const layer = document.createElement("div")
  layer.className = "textLayer"
  layer.style.position = "relative"
  layer.style.width = "800px"
  layer.style.height = "1000px"
  spans.forEach((t) => makeSpan(t, layer))
  if (parent) parent.appendChild(layer)
  return layer
}

// Crea un contenedor viewer típico
export function makeViewer({ withPageWrapper = false } = {}) {
  const viewer = document.createElement("div")
  viewer.id = "viewer"
  viewer.className = "pdfviewer__container"
  const canvas = document.createElement("canvas")
  canvas.id = "pdf-canvas"
  viewer.appendChild(canvas)
  const textLayer = document.createElement("div")
  textLayer.id = "text-layer"
  textLayer.className = "textLayer"
  viewer.appendChild(textLayer)
  document.body.appendChild(viewer)
  return { viewer, canvas, textLayer }
}

// Crea toolbar mínima con botones/inputs usados por los controllers
export function makeToolbar(html = "") {
  const toolbar = document.createElement("nav")
  toolbar.className = "toolbar"
  toolbar.innerHTML = html
  document.body.appendChild(toolbar)
  return toolbar
}

// Crea un input numérico simulado (value blur etc.)
export function makeInput(value = "") {
  const input = document.createElement("input")
  input.value = value
  return input
}

// Limpia fixtures entre tests
export function cleanup() {
  document.body.innerHTML = ""
  // Reset de estados globales importados
}
