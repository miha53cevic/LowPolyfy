window.onload = () => {
    createCanvas(640, 480);
    setupUI();
    main();
};

// TODO: add gradient option between 2 colours

function main() {

    const triangulation = new Delunay_Triangulation();

    // Create the set of points
    const sampler = new PoissonDiscSampler();
    let points = sampler.run(WIDTH, HEIGHT, 10);

    let triangles = triangulation.RunAlgorithm(points);

    const imageInput = document.getElementById('imageInput').addEventListener('change', function (e) {

        // Clear screen
        clear('white');

        const img = new Image();

        // Set image source to the one uploaded
        img.src = URL.createObjectURL(e.target.files[0]);

        // Wait for the picture to load
        img.onload = function () {

            const pixels = getPixelArray(img);

            // Draw the triangles
            // TODO - filter the edges and draw them only once
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
                const colour = pixels[imgPoint.y * img.width + imgPoint.x];

                // Fill the triangle with the pixel colour
                triangle.drawFill(`rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`, true, 'black', false);
                //triangle.drawCircumcircle();
            }

            console.log(`Number of triangles: ${triangles.length}`);
        };
    });
}

function setupUI() {
    const downloadButton = document.getElementById('download').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'picture.png';
        link.href = document.getElementById('canvas').toDataURL()
        link.click();
    });;

}