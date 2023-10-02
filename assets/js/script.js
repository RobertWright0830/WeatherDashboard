document.addEventListener("DOMContentLoaded", function () {
    var cityInput = document.getElementById("city-input");
    var searchButton = document.getElementById("search-button");
    var buttonList = document.getElementById("buttonList");
    var APIkey = "83b64cc3d3e21c19404a392f83496d54";
    var currentCard = document.querySelector(".current-card-content");
  
    var previousSearches =
      JSON.parse(localStorage.getItem("searchEntries")) || [];
  
    function addSearchEntry(cityName) {
      if (!previousSearches.includes(cityName)) {
        previousSearches.unshift(cityName);
  
        if (previousSearches.length > 8) {
          previousSearches.pop();
        }
  
        localStorage.setItem("searchEntries", JSON.stringify(previousSearches));
        updateButtonList();
      }
    }
  
    function updateButtonList() {
      buttonList.innerHTML = "";
  
      previousSearches.forEach((searchEntry) => {
        var button = document.createElement("button");
        button.textContent = searchEntry;
        button.classList.add("button");
  
        button.addEventListener("click", function () {
          search(searchEntry);
        });
  
        buttonList.appendChild(button);
      });
    }
  
    function logWeatherData(data) {
      console.log("Weather Data:", data);
    }

    function displayCurrentWeather(data) {
      currentCard.innerHTML = "";
  
      // City Name, Current Date, Weather Icon
      var cityNameElement = document.createElement("h1");
      cityNameElement.className = "title is-3"; 
      cityNameElement.textContent = data.name + " (" + dayjs().format("M/D/YYYY") + ")";
      currentCard.appendChild(cityNameElement);

      //Weather icon
      var weatherIconElement = document.createElement("i");
      var icon = data.weather[0].icon;
      var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
      var weatherIconElement = document.createElement("img");
      weatherIconElement.src = iconUrl;
      currentCard.appendChild(weatherIconElement);
 
      // Temperature in Kelvin
      var tempKelvin = data.main.temp;

      // Convert Kelvin to Fahrenheit
      var tempFahrenheit = ((tempKelvin - 273.15) * 9/5) + 32;

      // Display temperature in Fahrenheit
      var tempElement = document.createElement("h3");
      tempElement.textContent = "Temp: " + tempFahrenheit.toFixed(2) + "°F"; // Rounded to 2 decimal places
      currentCard.appendChild(tempElement);

      // Wind speed in meters per sec
      var windSpeedMPS = data.wind.speed;

      // Convert meters per sec to MPH
      var windSpeedMPH = (windSpeedMPS*2.237);

      // Display Wind in MPH
      var windElement = document.createElement("h3");
      windElement.textContent = "Wind: " + windSpeedMPH.toFixed(2) + "MPH";
      currentCard.appendChild(windElement);
  
      // Humidity
      var humidityElement = document.createElement("h3");
      humidityElement.textContent = "Humidity: " + data.main.humidity + "%";
      currentCard.appendChild(humidityElement);
    }
  
    function search(cityName) {
      //Data Validation
      if (cityName.trim() === "") {
        alert("Please enter a city name.");
        return;
      }
  
      var queryCurrentURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        APIkey;

      console.log(queryCurrentURL);

      var queryForecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=" +
        APIkey;

      console.log(queryForecastURL);
  
      fetch(queryCurrentURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("City not found");
          }
        })
        .then(function (data) {
          logWeatherData(data); // Log the weather data to the console
          displayCurrentWeather(data);
          cityInput.value = "";
          updateButtonList();
        })
        .catch(function (error) {
          console.error("Error:", error);
        });

        fetch(queryForecastURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("City not found");
          }
        })
        .then(function (data) {
          logWeatherData(data); // Log the weather data to the console
          
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    }
  
    // Attach click event listeners to each button in the button-list
    previousSearches.forEach((searchEntry) => {
      var button = document.createElement("button");
      button.textContent = searchEntry;
      button.classList.add("button");
  
      button.addEventListener("click", function () {
        search(searchEntry);
      });
  
      buttonList.appendChild(button);
    });
  
    // Add click event listener to the search button
    searchButton.addEventListener("click", function () {
      var cityName = cityInput.value;
      search(cityName);
      addSearchEntry(cityName);
    });
  });
  