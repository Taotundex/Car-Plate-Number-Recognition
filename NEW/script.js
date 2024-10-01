document.getElementById('recognize-btn').addEventListener('click', function () {
    const plateImage = document.getElementById('plate-image').files[0];
    
    if (plateImage) {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const imageSrc = e.target.result;

            // Use Tesseract.js to recognize text from the image
            Tesseract.recognize(
                imageSrc,
                'eng', // You can specify the language (English in this case)
                {
                    logger: (progress) => {
                        console.log(`Progress: ${Math.round(progress.progress * 100)}%`);
                    }
                }
            ).then(({ data: { text } }) => {
                // Display the recognized plate number
                document.getElementById('plate-number').innerText = text;
            }).catch((err) => {
                console.error(err);
                document.getElementById('plate-number').innerText = 'Error recognizing text';
            });
        };

        reader.readAsDataURL(plateImage);
    } else {
        alert("Please upload a car plate image.");
    }
});
