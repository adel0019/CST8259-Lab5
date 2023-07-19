$(document).ready(function () {

    function checkStoredRestaurant() {
        var storedRestaurantId = localStorage.getItem('selectedRestaurantId');
        if (storedRestaurantId) {
            $('#drpRestaurant').val(storedRestaurantId);
            getRestaurantDetails(storedRestaurantId);
        } else {
            clearRestaurantDetails();
        }
    }

    function getRestaurantNames() {
        resetRestaurantDetails();
        $.ajax({
            url: 'php/RestaurantReviews.php',
            method: 'GET',
            data: {
                action: 'getRestaurantNames'
            },
            success: function (response) {
                var restaurants = response.data;
                populateRestaurantDropdown(restaurants);
                checkStoredRestaurant();
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    function populateRestaurantDropdown(restaurants) {
        var dropdown = $('#drpRestaurant');
        dropdown.empty();
        dropdown.append('<option value="-1">Select ...</option>');
        for (var i = 0; i < restaurants.length; i++) {
            dropdown.append('<option value="' + restaurants[i].id + '">' + restaurants[i].name + '</option>');
        }
    }

    function getRestaurantDetails(restaurantId) {
        $.ajax({
            url: 'php/RestaurantReviews.php',
            method: 'GET',
            data: {
                action: 'getRestaurantDetails',
                id: restaurantId
            },
            success: function (response) {
                var details = response.data;
                displayRestaurantDetails(details);
                localStorage.setItem('selectedRestaurantId', restaurantId);
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    function displayRestaurantDetails(details) {
        $('#txtStreetAddress').val(details.streetAddress);
        $('#txtCity').val(details.city);
        $('#txtProvinceState').val(details.province);
        $('#txtPostalZipCode').val(details.postalCode);
        $('#txtSummary').val(details.summary);

        var ratingDropdown = $('#drpRating');
        ratingDropdown.empty();
        for (var i = details.rating.min; i <= details.rating.max; i++) {
            ratingDropdown.append('<option value="' + i + '">' + i + '</option>');
        }
        ratingDropdown.val(details.rating.current);
    }

    function saveRestaurantData() {
        var selectedRestaurantId = $('#drpRestaurant').val();
        var streetAddress = $('#txtStreetAddress').val();
        var city = $('#txtCity').val();
        var province = $('#txtProvinceState').val();
        var postalCode = $('#txtPostalZipCode').val();
        var summary = $('#txtSummary').val();
        var rating = $('#drpRating').val();

        var requestData = {
            id: selectedRestaurantId,
            streetAddress: streetAddress,
            city: city,
            province: province,
            postalCode: postalCode,
            summary: summary,
            rating: rating
        };

        $.ajax({
            url: 'php/RestaurantReviews.php',
            method: 'POST',
            data: JSON.stringify(requestData),
            success: function (response) {
                var result = response.data;
                displaySaveMessage(result.message);
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    function displaySaveMessage(message) {
        $('#lblConfirmation').text(message);
    }

    $('#btnSave').click(function () {
        saveRestaurantData();
    });

    function resetRestaurantDetails() {

        localStorage.removeItem('selectedRestaurantId');

        $('#txtStreetAddress').val('');
        $('#txtCity').val('');
        $('#txtProvinceState').val('');
        $('#txtPostalZipCode').val('');
        $('#txtSummary').val('');

        var ratingDropdown = $('#drpRating');
        ratingDropdown.empty();
    }

    $('#drpRestaurant').change(function () {
        var selectedRestaurantId = $(this).val();
        if (selectedRestaurantId !== '-1') {
            getRestaurantDetails(selectedRestaurantId);
        } else {
            resetRestaurantDetails();
        }
    });


    $('#restaurant-review-form').submit(function (event) {
        event.preventDefault();
    });


    $('a').click(function (event) {
        event.preventDefault();
    });

    getRestaurantNames();
});
