const ANNOTATION_CLASS = "annotation-overlay"

// rect ahora es { left, top, width, height } ya calculado por renderer.js
export function createOverlay(rect, ann) {
  const overlay = document.createElement("div")
  overlay.className = ANNOTATION_CLASS

  overlay.style.cssText = buildOverlayStyle({
    tool:      ann.tool,
    color:     ann.color,
    left:      rect.left,
    top:       rect.top,
    width:     rect.width,
    height:    rect.height,
    thickness: ann.thickness
  })

  return overlay
}

function buildOverlayStyle({ tool, color, left, top, width, height, thickness }) {
  if (tool === "highlight") {
    const h = height * (thickness / 10)
    const t = top + height - h
    return `
      position:absolute;
      left:${left}px;
      top:${t}px;
      width:${width}px;
      height:${h}px;
      background-color:${color};
      mix-blend-mode:multiply;
      pointer-events:none;
      z-index:5;
    `
  }

  if (tool === "underline") {
    return `
      position:absolute;
      left:${left}px;
      top:${top + height - thickness}px;
      width:${width}px;
      height:${thickness}px;
      background-color:${color};
      pointer-events:none;
      z-index:5;
    `
  }

  return ""
}