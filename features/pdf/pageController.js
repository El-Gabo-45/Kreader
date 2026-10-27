import { isScrollMode, getScrollMode } from "../../shared/state/scrollModeState.js"

const STORAGE_KEY = "pdf_last_page"

export function initPageController({ pdf, totalPages }) {
  const elements = getPageElements()
  if (!elements.pageInput) return

  const state = { currentPage: 1 }

  initUI(elements, totalPages)
  initEvents(elements, state, pdf, totalPages)

  const startPage = loadSavedPage(totalPages)
  goToPage(startPage, elements, state, pdf, totalPages)

  return {
    setPage: page => goToPage(page, elements, state, pdf, totalPages)
  }
}

function getPageElements() {
  return {
    pageInput:  document.querySelector(".toolbar__input--page"),
    totalLabel: document.querySelector(".toolbar__input__label"),
    prevBtn:    document.querySelector(".toolbar__button--prev"),
    nextBtn:    document.querySelector(".toolbar__button--next")
  }
}

function initUI({ pageInput, totalLabel }, totalPages) {
  if (totalLabel) totalLabel.textContent = `/ ${totalPages}`
  pageInput.min = 1
  pageInput.max = totalPages
}

function initEvents(elements, state, pdf, totalPages) {
  const { pageInput, prevBtn, nextBtn } = elements

  // Solo navegar al perder foco o Enter, nunca mientras escribe
  pageInput.addEventListener("blur", () => {
    const page = Number(pageInput.value)
    if (Number.isNaN(page)) {
      pageInput.value = state.currentPage
      return
    }
    goToPage(page, elements, state, pdf, totalPages)
  })

  pageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault()
      pageInput.blur()
    }
    // Cancelar cambio con Escape
    if (e.key === "Escape") {
      pageInput.value = state.currentPage
      pageInput.blur()
    }
  })

  // Evitar que el scroll robe el foco del input en modo scroll
  pageInput.addEventListener("mousedown", e => {
    e.stopPropagation()
  })

  pageInput.addEventListener("click", e => {
    e.stopPropagation()
    pageInput.select()
  })

  prevBtn?.addEventListener("click", () =>
    goToPage(state.currentPage - 1, elements, state, pdf, totalPages)
  )

  nextBtn?.addEventListener("click", () =>
    goToPage(state.currentPage + 1, elements, state, pdf, totalPages)
  )
}

function goToPage(page, elements, state, pdf, totalPages) {
  const { pageInput } = elements
  const clamped = clamp(page, 1, totalPages)

  state.currentPage = clamped
  pageInput.value   = clamped
  savePage(clamped)

  if (isScrollMode()) getScrollMode().goToPage(clamped)
  else pdf.renderPage(clamped)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function loadSavedPage(totalPages) {
  const saved = Number(localStorage.getItem(STORAGE_KEY))
  if (!Number.isNaN(saved) && saved >= 1 && saved <= totalPages) return saved
  return 1
}

function savePage(page) {
  localStorage.setItem(STORAGE_KEY, page)
}