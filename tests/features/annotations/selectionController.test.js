import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { initSelection } from "../../../features/annotations/selectionController.js"
import { annotations } from "../../../features/annotations/state.js"
import { viewerState } from "../../../shared/state/viewerState.js"

describe("selectionController", () => {
  let viewer, textLayer, span, textNode

  beforeEach(() => {
    document.body.innerHTML = ""
    annotations.length = 0
    viewerState.tool = null

    viewer = document.createElement("div")
    viewer.id = "viewer"
    viewer.className = "pdfviewer__container"
    textLayer = document.createElement("div")
    textLayer.className = "textLayer"
    viewer.appendChild(textLayer)
    document.body.appendChild(viewer)

    span = document.createElement("span")
    textNode = document.createTextNode("hola mundo")
    span.appendChild(textNode)
    textLayer.appendChild(span)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    annotations.length = 0
  })

  it("no crea anotaciones si no hay tool activo", () => {
    initSelection({ viewer, getCurrentPage: () => 1, getCurrentRotation: () => 0 })
    document.dispatchEvent(new MouseEvent("mouseup"))
    expect(annotations).toHaveLength(0)
  })

  it("getSpanOffsets devuelve null si no hay solapamiento", () => {
    // Probado indirectamente: selección colapsada no crea nada
    initSelection({ viewer, getCurrentPage: () => 1, getCurrentRotation: () => 0 })
    viewerState.tool = "highlight"
    document.dispatchEvent(new MouseEvent("mouseup"))
    expect(annotations).toHaveLength(0)
  })
})
