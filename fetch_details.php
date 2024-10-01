<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $plateNumber = $_POST['plateNumber'];

    // Replace with the actual API endpoint and your API key
    // $apiUrl = "https://api.government.gov/plate-details?plateNumber=" . urlencode($plateNumber);
    $apiUrl = "https://car-license-plate-detection.p.rapidapi.com/recognizeCars";
    $apiKey = "YOUR_API_KEY_HERE";

    // cURL request to the government API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey",
        "Content-Type: application/json"
    ]);

    $response = curl_exec($ch);

    if ($response === false) {
        echo json_encode(['success' => false, 'error' => 'API request failed.']);
    } else {
        $data = json_decode($response, true);

        if (isset($data['error'])) {
            echo json_encode(['success' => false, 'error' => 'Invalid plate number or details not found.']);
        } else {
            echo json_encode([
                'success' => true,
                'owner' => $data['owner'],
                'make' => $data['make'],
                'model' => $data['model'],
                'year' => $data['year']
            ]);
        }
    }

    curl_close($ch);
}
?>
