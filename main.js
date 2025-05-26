//This is to just obtain the values
const highlighter = document.getElementById("highlighter");
const underliner = document.getElementById("underliner");
const imagecontainer = document.getElementById("imagecontainer");
const searchingcontainer = document.getElementById("searchingcontainer");
const viewercontainer = document.getElementById("viewer")
const filenameInput = document.getElementById("filename");
const rotateLeftBtn = document.getElementById("rotate-left");
const rotateRightBtn = document.getElementById("rotate-right");
const imageInput = document.getElementById("imagefile");
// This is to hear the buttons
const highlightBtn = document.getElementById("highlight-btn");
const underlineBtn = document.getElementById("underline-btn");
const imageBtn = document.getElementById("image-btn");
const signBtn = document.getElementById("sign-btn");
const searchBtn = document.getElementById("search-btn")
const rotateBtn = document.getElementById("rotate-btn")

const bottons = document.querySelectorAll("button");

const highlighterCustomColor = document.getElementById("highlighter-customcolor");
const underlinerCustomColor = document.getElementById("underliner-customcolor");

const highlighterCustomContainer = document.getElementById("customizedcolors");
const underlineCustomContainer = document.getElementById("customizedcolorsunderline");

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

const textLayer = document.getElementById('text-layer');

const url = './pdf-_matematicas_basicas-_completo-_09-15.pdf';

const prevBtn = document.getElementById('previouspage-btn');
const nextBtn = document.getElementById('nextpage-btn');
const totalPagesEl = document.getElementById('totalpages');
const zoomInBtn = document.getElementById('zoomin-btn');
const zoomOutBtn = document.getElementById('zoomout-btn');
const pdfViewer = document.getElementById('viewer');
const canvasContainer =document.getElementById('pdf-canvas')
const pageInput = document.getElementById('pageinput');
const toggleBtn = document.getElementById('toggle-theme');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');
const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

let activeButton = null;
let pdfDoc = null;
let currentPage = 1;
let rendering = false;
let currentScale = 1.5;
let rotation = 0;
let filename = '';
let rotationAngle = 0;
let hasConfirmedOnce = false;
let hasConfirmedOnceUnderline = false;

function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  iconSun.style.display = isDark ? 'block' : 'none';
  iconMoon.style.display = isDark ? 'none' : 'block';
}

function applyThemeFromSource(source = 'auto') {
  const userChoice = localStorage.getItem('theme');
  if (userChoice === 'dark') {
    setTheme(true);
  } else if (userChoice === 'light') {
    setTheme(false);
  } else {
    setTheme(prefersDarkMedia.matches);
  }
}

prefersDarkMedia.addEventListener('change', (e) => {
  const userChoice = localStorage.getItem('theme');
  if (!userChoice) {
    setTheme(e.matches);
  }
});

toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  const newIsDark = !isDark;

  setTheme(newIsDark);
  localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
});

applyThemeFromSource();

function togglePopup(target) {
    [highlighter, underliner, imagecontainer, imagecontainer].forEach(popup => {
        if (popup !== target) popup.style.display = "none";
    });
    target.style.display = (target.style.display === "none" || target.style.display === "") ? "block" : "none";
}

highlightBtn.addEventListener("click", () => togglePopup(highlighter));
underlineBtn.addEventListener("click", () => togglePopup(underliner));
imageBtn.addEventListener("click", () => togglePopup(imagecontainer));
searchBtn.addEventListener("click", () => togglePopup(searchingcontainer));


bottons.forEach(button => {
    button.addEventListener("click", () => {
        if (activeButton) activeButton.classList.remove("activo");
        button.classList.add("activo");
        activeButton = button;
    });
});

function createColorButton(color, isCustom = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tools-color";
    if (isCustom) button.classList.add("tools-color--custom");
    button.setAttribute("data-color", color);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("class", "lucide lucide-circle");

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");
    circle.setAttribute("fill", color);

    svg.appendChild(circle);
    button.appendChild(svg);
    return button;
}

highlighterCustomColor.addEventListener("change", function () {
    const color = highlighterCustomColor.value;
    const button = createColorButton(color, true); 
    const customButtons = highlighterCustomContainer.querySelectorAll(".tools-color--custom");
    if (customButtons.length >= 5) { 
        if (!hasConfirmedOnce) {
            const confirmed = confirm("You've reached the limit of custom colors. Do you want to start replacing the oldest ones?");
            if (!confirmed) return;
            hasConfirmedOnce = true;
        }
        customButtons[0].remove(); 
    }
    highlighterCustomContainer.appendChild(button);
});

underlinerCustomColor.addEventListener("change", function () {
    const color = underlinerCustomColor.value;
    const button = createColorButton(color, true); // isCustom = true
    const customButtons = underlineCustomContainer.querySelectorAll(".tools-color--custom");
    if (customButtons.length >= 5) {
        if (!hasConfirmedOnceUnderline) {
            const confirmed = confirm("You've reached the limit of custom underline colors. Do you want to start replacing the oldest ones?");
            if (!confirmed) return;
            hasConfirmedOnceUnderline = true;
        }
        customButtons[0].remove(); // Elimina el más antiguo
    }
    underlineCustomContainer.appendChild(button);
});
function extractFileNameFromUrl(url) {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart.split('?')[0]);
}
// Upload PDF and render the first page
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    totalPagesEl.textContent = pdfDoc.numPages;
    renderPage(currentPage);
    filename = extractFileNameFromUrl(url);
    filenameInput.value = filename;
});

function renderPage(num, scale = currentScale) {
    if (rendering) return;
    rendering = true;

    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale, rotation: rotation});

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        textLayer.innerHTML = "";
        textLayer.style.height = `${viewport.height}px`;
        textLayer.style.width = `${viewport.width}px`;
        textLayer.style.setProperty("--scale-factor", scale);

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        return page.render(renderContext).promise
            .then(() => page.getTextContent())
            .then(textContent => pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textLayer,
                viewport: viewport,
                textDivs: []
            }).promise);
    }).then(() => {
        rendering = false;
        pageInput.value = num;
    });
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

zoomInBtn.addEventListener('click', () => {
  currentScale = Math.min(currentScale + 0.1, 3.0);
  renderPage(currentPage, currentScale);
});

zoomOutBtn.addEventListener('click', () => {
  currentScale = Math.max(currentScale - 0.1, 0.5);
  renderPage(currentPage, currentScale);
});

pageInput.addEventListener('change', () => {
    let desiredPage = parseInt(pageInput.value);
    if (!isNaN(desiredPage) && desiredPage >= 1 && desiredPage <= pdfDoc.numPages) {
        currentPage = desiredPage;
        renderPage(currentPage);
    } else {
        // If the value is invalid reset the input to the current value
        pageInput.value = currentPage;
        alert(`Por favor ingresa un número entre 1 y ${pdfDoc.numPages}`);
    }
});

function rotateCanvas(angle) {
    rotationAngle = (rotationAngle + angle) % 360;
    const container = document.getElementById('viewer');
    pdfViewer.style.transform = `rotate(${rotationAngle}deg)`;
}

rotateLeftBtn.addEventListener("click", () => rotateCanvas(-90));
rotateRightBtn.addEventListener("click", () => rotateCanvas(90));
rotateBtn.addEventListener("click", () => rotateCanvas(180));

function rotateContainer(direction) {
    if (direction === 'left') {
        rotationAngle = (rotationAngle - 90 + 360) % 360;
    } else if (direction === 'right') {
        rotationAngle = (visualRotation + 90) % 360;
    } else if (direction === 'flip') {
        rotationAngle = (rotationAngle + 180) % 360;
    }

    const viewercontainer = document.getElementById('page-container');
    pdfViewer.style.transform = `rotate(${visualRotation}deg)`;
    pdfViewer.style.transformOrigin = 'center center';
}
let selectedContainer = null; // global

document.getElementById("imagefile").onchange = function () {
    const ul = document.getElementById("viewer");
    const file = this.files[0];
    const read = new FileReader();

    read.onload = function () {
        const url = this.result;

        // Contenedor
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "100px";
        container.style.left = "100px";
        container.style.zIndex = 1000;
        container.style.display = "inline-block";
        container.style.userSelect = "none";

        // Imagen
        const image = document.createElement("img");
        image.src = url;
        image.style.width = "250px";
        image.style.height = "auto";
        image.style.display = "block";
        image.style.pointerEvents = "auto";
        image.style.userSelect = "none";

        // Resizers
        const resizerStyle = `
            width: 10px;
            height: 10px;
            background: white;
            border: 1px solid #666;
            position: absolute;
            z-index: 10;
        `;

        const positions = [
            { name: "top-left", x: "0%", y: "0%", cursor: "nwse-resize" },
            { name: "top", x: "50%", y: "0%", cursor: "ns-resize" },
            { name: "top-right", x: "100%", y: "0%", cursor: "nesw-resize" },
            { name: "left", x: "0%", y: "50%", cursor: "ew-resize" },
            { name: "right", x: "100%", y: "50%", cursor: "ew-resize" },
            { name: "bottom-left", x: "0%", y: "100%", cursor: "nesw-resize" },
            { name: "bottom", x: "50%", y: "100%", cursor: "ns-resize" },
            { name: "bottom-right", x: "100%", y: "100%", cursor: "nwse-resize" },
        ];

        positions.forEach(pos => {
            const resizer = document.createElement("div");
            resizer.className = "resizer";
            resizer.dataset.position = pos.name;
            resizer.style.cssText = resizerStyle;
            resizer.style.left = pos.x;
            resizer.style.top = pos.y;
            resizer.style.transform = "translate(-50%, -50%)";
            resizer.style.cursor = pos.cursor;

            resizer.addEventListener("mousedown", function (e) {
                e.stopPropagation();
                e.preventDefault();

                const startX = e.pageX;
                const startY = e.pageY;
                const startWidth = image.offsetWidth;
                const startHeight = image.offsetHeight;
                const startLeft = container.offsetLeft;
                const startTop = container.offsetTop;

                function onMouseMove(ev) {
                    const dx = ev.pageX - startX;
                    const dy = ev.pageY - startY;

                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    if (pos.name.includes("right")) newWidth = startWidth + dx;
                    if (pos.name.includes("left")) {
                        newWidth = startWidth - dx;
                        newLeft = startLeft + dx;
                    }
                    if (pos.name.includes("bottom")) newHeight = startHeight + dy;
                    if (pos.name.includes("top")) {
                        newHeight = startHeight - dy;
                        newTop = startTop + dy;
                    }

                    if (newWidth > 30) {
                        image.style.width = newWidth + "px";
                        container.style.left = newLeft + "px";
                    }

                    if (newHeight > 30) {
                        image.style.height = newHeight + "px";
                        container.style.top = newTop + "px";
                    }
                }

                function onMouseUp() {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });

            container.appendChild(resizer);
        });

        // Movimiento fluido
        container.addEventListener("mousedown", function (e) {
            if (!e.target || e.target.className === "resizer") return;

            e.preventDefault();
            const shiftX = e.pageX - container.offsetLeft;
            const shiftY = e.pageY - container.offsetTop;

            function moveAt(pageX, pageY) {
                container.style.left = pageX - shiftX + "px";
                container.style.top = pageY - shiftY + "px";
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        image.ondragstart = () => false;

        container.appendChild(image);
        ul.appendChild(container);

        // Selección al hacer clic en la imagen
        container.addEventListener("click", function (e) {
            e.stopPropagation();
            if (selectedContainer) {
                selectedContainer.style.outline = "";
            }
            selectedContainer = container;
            container.style.outline = "2px dashed red";
        });
    };

    read.readAsDataURL(file);
};

// Deseleccionar al hacer clic afuera
document.addEventListener("click", function () {
    if (selectedContainer) {
        selectedContainer.style.outline = "";
        selectedContainer = null;
    }
});

// Eliminar con Delete
document.addEventListener("keydown", function (e) {
    if (e.key === "Delete" && selectedContainer) {
        selectedContainer.remove();
        selectedContainer = null;
    }
});
