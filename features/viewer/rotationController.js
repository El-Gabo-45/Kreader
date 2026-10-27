export function initRotation({ pdf }) {
  const actions = [
    { selector: ".toolbar__button--rotateleft",  handler: () => pdf.rotateLeft() },
    { selector: ".toolbar__button--rotateright", handler: () => pdf.rotateRight() },
    { selector: ".toolbar__button--flip",        handler: () => pdf.flip() }
  ]

  actions.forEach(({ selector, handler }) => {
    const button = document.querySelector(selector)
    if (!button) return

    button.addEventListener("click", handler)
  })
}