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