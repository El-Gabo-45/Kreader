export function createDomMap() {
  return {
    viewer:    document.querySelector("#viewer"),
    canvas:    document.querySelector("#pdf-canvas"),
    textLayer: document.querySelector("#text-layer"),

    toolbar: {
      highlightBtn: document.querySelector(".toolbar__button--highlight"),
      underlineBtn: document.querySelector(".toolbar__button--underline")
    },

    search: {
      input:  document.querySelector(".toolbar__popup__search-input"),
      button: document.querySelector(".toolbar__popup__search-button--next")
    },

    colorInputs: document.querySelectorAll(".toolbar__popup__customcolor-input")
  }
}