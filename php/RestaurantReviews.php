<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'getRestaurantNames') {
        $xml = simplexml_load_file('../Data/restaurant_reviews.xml');
        $xml->registerXPathNamespace('ns', 'http://www.algonquincollege.com/cst8259/labs');

        $restaurantNames = [];
        $restaurants = $xml->xpath('//ns:restaurant');
        foreach ($restaurants as $index => $restaurant) {
            $restaurantNames[] = [
                'id' => $index,
                'name' => (string) $restaurant->attributes()->name
            ];
        }
        echo json_encode(['data' => $restaurantNames]);
    } elseif ($_GET['action'] === 'getRestaurantDetails') {
        $xml = simplexml_load_file('../Data/restaurant_reviews.xml');
        $xml->registerXPathNamespace('ns', 'http://www.algonquincollege.com/cst8259/labs');

        $restaurantId = $_GET['id'];
        $restaurant = $xml->xpath('//ns:restaurant')[$restaurantId];
        $details = [
            'streetAddress' => (string) $restaurant->address->street,
            'city' => (string) $restaurant->address->city,
            'province' => (string) $restaurant->address->province,
            'postalCode' => (string) $restaurant->address->postal_code,
            'summary' => (string) $restaurant->summary,
            'rating' => [
                'min' => (int) $restaurant->rating['min'],
                'max' => (int) $restaurant->rating['max'],
                'current' => (int) $restaurant->rating
            ]
        ];
        echo json_encode(['data' => $details]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $xml = simplexml_load_file('../Data/restaurant_reviews.xml');
    $xml->registerXPathNamespace('ns', 'http://www.algonquincollege.com/cst8259/labs');

    $restaurantId = $data['id'];
    $restaurant = $xml->xpath('//ns:restaurant')[$restaurantId];
    $restaurant->address->street = $data['streetAddress'];
    $restaurant->address->city = $data['city'];
    $restaurant->address->province = $data['province'];
    $restaurant->address->postal_code = $data['postalCode'];
    $restaurant->summary = $data['summary'];
    $restaurant->rating = $data['rating'];
    $xml->asXML('../Data/restaurant_reviews.xml');

    echo json_encode(['data' => ['message' => 'Restaurant data saved successfully']]);
}
?>
