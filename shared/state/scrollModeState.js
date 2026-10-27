    let scrollMode = null
    const listeners = new Set()

    export function setScrollMode(api) {
    scrollMode = api
    notifyListeners(isScrollMode())
    }

    export function getScrollMode() {
    return scrollMode
    }

    export function isScrollMode() {
    return scrollMode !== null
    }

    export function onScrollModeChange(fn) {
    if (typeof fn !== "function") return () => {}

    listeners.add(fn)

    return () => {
        listeners.delete(fn)
    }
    }

    function notifyListeners(isActive) {
    for (const fn of listeners) {
        try {
        fn(isActive)
        } catch (err) {
        console.error("ScrollMode listener error:", err)
        }
    }
    }