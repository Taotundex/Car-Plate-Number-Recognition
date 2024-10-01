// Access the user's camera and stream the video feed
const video = document.getElementById('video');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
}

function recognizePlate() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Scanning...';

    // Create a canvas element to capture the current frame from the video feed
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    // Draw the current frame from the video onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to an image and pass it to Tesseract.js for OCR
    Tesseract.recognize(
        canvas,
        'eng',
        {
            logger: (m) => console.log(m) // For debugging and progress updates
        }
    ).then(({ data: { text } }) => {
        resultDiv.innerHTML = `Recognized Plate Number: <strong>${text.trim()}</strong>`;
    }).catch(error => {
        resultDiv.innerHTML = `Error recognizing plate number: ${error.message}`;
    });
}
