document.getElementById('recognize-btn').addEventListener('click', function () {
    const plateImage = document.getElementById('plate-image').files[0];
    const apiKey = 'd68f08dac8737b7d623692a68bc0df589dc5bd5a'; // Replace with your OpenALPR API Key

    if (plateImage) {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const imageSrc = e.target.result;

            // Convert the base64 data URL to a Blob
            const base64String = imageSrc.split(',')[1];
            const binaryString = window.atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });

            // Create FormData and append the image Blob
            const formData = new FormData();
            formData.append('image', blob);

            // Send the request to OpenALPR API
            fetch(`https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=us&secret_key=${apiKey}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const plateNumber = data.results[0].plate;
                    document.getElementById('plate-number').innerText = plateNumber;
                } else {
                    document.getElementById('plate-number').innerText = 'No plate recognized';
                }
            })
            .catch(error => {
                console.error(error);
                document.getElementById('plate-number').innerText = 'Error recognizing plate';
            });
        };

        reader.readAsDataURL(plateImage);
    } else {
        alert("Please upload a car plate image.");
    }
});
