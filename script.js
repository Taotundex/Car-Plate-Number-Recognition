const uploadInput = document.getElementById('file');
const imageElement = document.getElementById('uploaded-image');
const canvas = document.getElementById('capture-canvas');
const loader = document.getElementById('loader');
const uploadButton = document.getElementById('upload-btn');

let imageLoaded = false;

// Show uploaded image preview
uploadInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block'; // Show the image
            imageLoaded = true; // Indicate that an image has been loaded
        };
        reader.readAsDataURL(file);
    }
});

// Preprocess image: Convert to grayscale and apply binarization (black and white)
function preprocessImage(context, canvas) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and binarize
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const binarizedValue = avg > 128 ? 255 : 0; // Binarization (Black and White)
        data[i] = binarizedValue;        // Red
        data[i + 1] = binarizedValue;    // Green
        data[i + 2] = binarizedValue;    // Blue
    }

    context.putImageData(imageData, 0, 0);
}

// Handle the "Start Scanning" button click
uploadButton.addEventListener('click', () => {
    if (!imageLoaded) {
        alert('Please upload an image first!');
        return;
    }

    loader.style.display = 'block'; // Show loader
    uploadButton.disabled = true;  // Disable button during scanning

    const context = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        // Dynamically set the canvas size based on the uploaded image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the uploaded image onto the canvas
        context.drawImage(img, 0, 0);

        // Preprocess the image for better OCR accuracy
        preprocessImage(context, canvas);

        // Get image data from canvas as a base64 URL
        const imageData = canvas.toDataURL();

        // Use Tesseract.js for OCR
        Tesseract.recognize(
            imageData,
            'eng',
            {
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Only allow characters from car plates
                psm: 6 // Fully automatic page segmentation, single block of text
            }
        ).then(({ data: { text } }) => {
            const plateNumber = text.trim(); // Extracted plate number
            localStorage.setItem('plateNumber', plateNumber); // Save number for next page
            loader.style.display = 'none'; // Hide loader
            uploadButton.disabled = false; // Re-enable button
            window.location.href = 'result.html'; // Redirect to result page
        }).catch(err => {
            console.error('OCR Error: ', err);
            loader.style.display = 'none'; // Hide loader
            uploadButton.disabled = false; // Re-enable button
        });
    };

    img.src = imageElement.src; // Set the image source from the preview
});