let lastSelected = null

export function selectionColorBorder(svg) {
  if (!svg) return

  if (lastSelected && lastSelected !== svg) {
    lastSelected.classList.remove("selected")
  }

  svg.classList.add("selected")
  lastSelected = svg
}

export function clearColorSelection() {
  if (!lastSelected) return

  lastSelected.classList.remove("selected")
  lastSelected = null
}