document.addEventListener("DOMContentLoaded", function () {

    var cityInput = document.getElementById('city-input');
var searchButton = document.getElementById('search-button');
var buttonList = document.getElementById('buttonList');
var APIkey = "83b64cc3d3e21c19404a392f83496d54";





var previousSearches = JSON.parse(localStorage.getItem('searchEntries')) || [];

function addSearchEntry(cityName) {

    previousSearches.unshift(cityName);

    if (previousSearches.length > 8) {
        previousSearches.pop();
    }

    localStorage.setItem('searchEntries', JSON.stringify(previousSearches));

    updateButtonList();
}

function updateButtonList() {
    buttonList.innerHTML = '';

    previousSearches.forEach((searchEntry) => {
        var button = document.createElement('button');
        button.textContent = searchEntry;
        button.classList.add('button');

        button.addEventListener('click', function () {
            cityInput.value = searchEntry;
            search();
        });

        buttonList.appendChild(button);
    });
}

function logWeatherData(data) {
    console.log("Weather Data:", data);
}

function search() {
    var cityName = cityInput.value;

    //Data Validation
    if (cityName.trim() === "") {
            alert("Please enter a city name.");
            return;

    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput.value + "&appid="+APIkey;
console.log(queryURL);

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("City not found");
            }
        })
        .then(function (data) {
            logWeatherData(data); // Log the weather data to the console
            addSearchEntry(cityName);
            cityInput.value = '';
        })
        .catch(function (error) {
            console.error("Error:", error);
        });
}

searchButton.addEventListener('click', search);

updateButtonList();
});