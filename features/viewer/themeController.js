export function initTheme() {

  const btn  = document.querySelector(".toolbar__button--themeswitch")
  const moon = document.querySelector("#moon")
  const sun  = document.querySelector("#sun")

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

  function applyTheme(isDark) {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")

    if (moon) moon.style.display = isDark ? "none" : "block"
    if (sun)  sun.style.display  = isDark ? "block" : "none"
  }

  function handleSystemChange(e) {
    applyTheme(e.matches)
  }

  applyTheme(prefersDark.matches)

  prefersDark.addEventListener("change", handleSystemChange)

  btn?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark"

    applyTheme(!isDark)

    prefersDark.removeEventListener("change", handleSystemChange)
  })

}