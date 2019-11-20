// Option booleans
let darkmode = false;
let removeStroke1 = true;
let removeStroke2 = true;
let colour1 = '#000000';
let colour2 = '#FFFFFF';
let complexity = 50;

// Main()
window.onload = () => {
    createCanvas(400, 400);
    setupDesign();
    generateFromImage();
};

function generate() {
    checkForResize();

    // Set canvas to visible
    document.getElementById('canvasArea').style.display = 'block';

    const triangulation = new Delunay_Triangulation();
    const sampler = new PoissonDiscSampler();

    // Create the set of points
    let points = sampler.run(WIDTH, HEIGHT, complexity);

    // Clear screen
    clear('white');

    // Run algorithm
    let triangles = triangulation.RunAlgorithm(points);

    // Draw the triangles
    for (let triangle of triangles) {
        // Fill colour is determined by how far the circumCenter is from the left
        // and mapped to a percentage 0%-100%
        const circumCenter = triangle.CircumcircleCenterPoint();
        const percentage = toInt(map(circumCenter.x, 0, WIDTH, 0, 100));
        let newColor = makeGradientColor(hexToRgb(colour1), hexToRgb(colour2), percentage);

        // Convert from object to string
        function toColour(c) {
            return `rgb(${c.r}, ${c.g}, ${c.b})`;
        }

        // Darkened gradient walllpaper
        if (darkmode) {
            // Random chance to darken triangle
            let colour = {
                r: 50,
                g: 50,
                b: 50
            };

            // Add random darkening to triangles
            const factor = Math.random();
            colour.r *= factor;
            colour.g *= factor;
            colour.b *= factor;

            triangle.drawFill(toColour(colour), true, toColour(colour));
        } else {
            // Normal gradient
            triangle.drawFill(toColour(newColor), !removeStroke2);
        }
    }

    console.log(`Number of triangles: ${triangles.length}`);
}

function setupDesign() {

    // Setup options
    const imageList = document.getElementById('image');
    const gradientList = document.getElementById('gradient');

    // By default imageList is active
    gradientList.style.display = 'none';

    // Generate button
    const generateButton = document.getElementById('generate');

    generateButton.addEventListener('click', () => {
        console.clear();
        generate();
    });

    // Triangulate image
    const imageButton = document.getElementById('item1');

    imageButton.addEventListener('click', () => {
        imageList.style.display = 'block';
        gradientList.style.display = 'none';

        // Hide generate button when in image option
        generateButton.style.display = 'none';
    });

    // Create pattern
    const gradientButton = document.getElementById('item2');

    gradientButton.addEventListener('click', () => {
        imageList.style.display = 'none';
        gradientList.style.display = 'block';

        // Unhide generate button when in gradient option
        generateButton.style.display = 'block';
    });

    // Option buttons
    const darkmodeButton = document.getElementById('dark-mode');

    darkmodeButton.addEventListener('change', () => {
        if (darkmode) {
            darkmode = false;
        } else {
            darkmode = true;
        }
    });

    const removeStrokeButton1 = document.getElementById('remove-stroke1');

    removeStrokeButton1.addEventListener('change', () => {
        if (removeStroke1) {
            removeStroke1 = false;
        } else {
            removeStroke1 = true;
        }
    });

    const removeStrokeButton2 = document.getElementById('remove-stroke2');

    removeStrokeButton2.addEventListener('change', () => {
        if (removeStroke2) {
            removeStroke2 = false;
        } else {
            removeStroke2 = true;
        }
    });

    // Colour options
    const colour1Button = document.getElementById('colour1');

    colour1Button.addEventListener('change', () => {
        colour1 = colour1Button.value;
    });

    const colour2Button = document.getElementById('colour2');

    colour2Button.addEventListener('change', () => {
        colour2 = colour2Button.value;
    });

    const complexityRange = document.getElementById('complexity');

    complexityRange.addEventListener('change', () => {
        complexity = complexityRange.value;
    });
}

function checkForResize() {
    // Rade se dvije provjere jer na mobilnoj verziji canvas nema nikakvu velicinu pa se uzima velicina generate buttona
    // a kod desktop verzije je obrnuto pa se mora gledati canvas jer je on 3:1 veci
    if (document.getElementsByClassName('header')[0].clientWidth >= document.getElementsByClassName('canvas')[0].clientWidth) {
        const layer = document.getElementsByClassName('header')[0];
        const canvas = document.getElementById('canvas');
        canvas.width = layer.clientWidth;
        canvas.height = layer.clientWidth;
        WIDTH = layer.clientWidth;
        HEIGHT = layer.clientWidth;
    } else {
        const layer = document.getElementsByClassName('canvas')[0];
        const canvas = document.getElementById('canvas');
        canvas.width = layer.clientWidth;
        canvas.height = layer.clientHeight;
        WIDTH = layer.clientWidth;
        HEIGHT = layer.clientHeight;
    }
}