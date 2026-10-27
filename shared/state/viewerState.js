export const viewerState = {
  tool: null,
  color: {
    highlight: "#ffff00",
    underline: "#000000",
    default:   "#ffff00"
  },
  page: 1,
  zoom: 1.5,
  thickness: { highlight: 10, underline: 2 }
}

export function setTool(tool)                 { viewerState.tool = tool }
export function setThickness(tool, thickness) { viewerState.thickness[tool] = thickness }

export function setColor(color) {
  const tool = viewerState.tool
  if (tool && tool in viewerState.color) {
    viewerState.color[tool] = color
  } else {
    viewerState.color.default = color
  }
}

export function getColor() {
  const tool = viewerState.tool
  if (tool && tool in viewerState.color) {
    return viewerState.color[tool]
  }
  return viewerState.color.default
}