//This is to just obtain the values
const highlighter = document.getElementById("highlighter");
const underliner = document.getElementById("underliner");
const imagecontainer = document.getElementById("imagecontainer");
const searchingcontainer = document.getElementById("searchingcontainer");
const viewercontainer = document.getElementById("viewer")
const filenameInput = document.getElementById("filename");
const rotateLeftBtn = document.getElementById("rotate-left");
const rotateRightBtn = document.getElementById("rotate-right");
const pageContainer = document.getElementById('page-container');

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

let activeButton = null;
let pdfDoc = null;
let currentPage = 1;
let rendering = false;
let zoomLevel = 1.0;
let rotation = 0;
let filename = '';
let rotationAngle = 0;


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

function createColorButton(color) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tools-color";
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
    const button = createColorButton(color);
    highlighterCustomContainer.appendChild(button);
});

underlinerCustomColor.addEventListener("change", function () {
    const color = underlinerCustomColor.value;
    const button = createColorButton(color);
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

function renderPage(num) {
    if (rendering) return;
    rendering = true;

    pdfDoc.getPage(num).then(page => {
        const scale = 1.5;
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
    zoomLevel = Math.min(3, zoomLevel + 0.1);
    pdfViewer.style.transform = `scale(${zoomLevel})`;
});

zoomOutBtn.addEventListener('click', () => {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    pdfViewer.style.transform = `scale(${zoomLevel})`;
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