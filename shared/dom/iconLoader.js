const cache = new Map()

export async function loadIcons() {
  const elements = document.querySelectorAll("[data-icon]")

  await Promise.all(Array.from(elements).map(async el => {
    const name = el.dataset.icon

    if (!cache.has(name)) {
      const res = await fetch(`./assets/icons/${name}.svg`)
      const svg = await res.text()
      cache.set(name, svg)
    }

    el.innerHTML = cache.get(name)
  }))
}