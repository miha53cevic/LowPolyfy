class Pixel {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

function getPixelArray(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext('2d');

    // Draw the image on the hidden canvas so we can get data from it
    context.drawImage(img, 0, 0);

    // Get Data from canvas
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let pixels = [];

    // data has pixels stored in r, g, b, a so every 4 elements are a pixel
    for (let i = 0; i < imageData.length; i += 4) {
        pixels.push(new Pixel(imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]));
    }

    return pixels;
}

// Setup event for file input
function generateFromImage() {
    const imageInput = document.getElementById('imageInput').addEventListener('change', function (e) {

        // Check if canvas needs to be resized
        checkForResize();

        // Set canvas to visible
        document.getElementById('canvasArea').style.display = 'block';

        const triangulation = new Delunay_Triangulation();

        // Create the set of points
        const sampler = new PoissonDiscSampler();
        const points = sampler.run(WIDTH, HEIGHT, complexity);

        const triangles = triangulation.RunAlgorithm(points);

        // Clear screen
        clear('white');

        const img = new Image();

        // Set image source to the one uploaded
        img.src = URL.createObjectURL(e.target.files[0]);

        // Wait for the picture to load
        img.onload = function () {

            const pixels = getPixelArray(img);

            // Draw the triangles
            for (let triangle of triangles) {

                // Remove circumcenters that are outside of the canvas
                const circumCenter = triangle.CircumcircleCenterPoint();
                if (circumCenter.x < 0 || circumCenter.x >= WIDTH || circumCenter.y < 0 || circumCenter.y >= HEIGHT) {
                    continue;
                }
                // Convert circumcenter position from canvas to percentage (0 - 1)
                // then take that percentage and take the pixel on the img at that percentage
                // Percentage: circumCenter.x / WIDTH, multiplied by the image to get the pixel at that percentage
                const imgPoint = {
                    x: toInt(img.width * (circumCenter.x / WIDTH)),
                    y: toInt(img.height * (circumCenter.y / HEIGHT))
                };

                // Get the pixel from the percentage
                const ImgPixel = pixels[imgPoint.y * img.width + imgPoint.x];

                // Set the colour
                const colour = `rgba(${ImgPixel.r}, ${ImgPixel.g}, ${ImgPixel.b}, ${ImgPixel.a})`;

                // Fill the triangle with the pixel colour
                triangle.drawFill(colour, removeStroke1, colour);
            }

            console.log(`Number of triangles: ${triangles.length}`);
        };
    });
}