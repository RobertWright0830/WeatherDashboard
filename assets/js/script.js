//Event listener to ensure DOM loads before executing script
document.addEventListener("DOMContentLoaded", function () {
    //Variables for DOM elements and API key
    var cityInput = document.getElementById("city-input");
    var searchButton = document.getElementById("search-button");
    var buttonList = document.getElementById("buttonList");
    var APIkey = "83b64cc3d3e21c19404a392f83496d54";
    var currentCard = document.querySelector(".current-card-content");
    var forecastCards = document.querySelector(".forecast-cards");
    var previousSearches =
      JSON.parse(localStorage.getItem("searchEntries")) || [];

    //Opening screen default to San Antonio
    search("San Antonio");

    //Main search function to fetch weather data
    function search(cityName) {
      //Data Validation
      if (cityName.trim() === "") {
        alert("Please enter a city name.");
        return;
      }
      
      //URLs for current weather and forecast
      var queryCurrentURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        APIkey;

      var queryForecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=" +
        APIkey;

      //Fetch for current weather data
      fetch(queryCurrentURL)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("City not found");
          }
          return response.json();
        })
        .then(function (data) {
          logWeatherData(data);
          displayCurrentWeather(data);
          cityInput.value = "";
          addSearchEntry(cityName);
          updateButtonList();
        })
        .catch(function (error) {
          alert("City not found");
          console.error("Error:", error);
        });

        //Fetch for forecast data
        fetch(queryForecastURL)
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("City not found");
          }
        })
        .then(function (data) {
          logWeatherData(data);
          forecastCards.innerHTML = "";

          var currentDate = dayjs();

          var timestamps = Object.keys(data.list);

          //Timestamp filter to select one per day
          var selectedTimestamps = timestamps.filter((timestamp, index) => index %8 ===7);

        // Loop to create 5 forecast cards
        for (var i = 0; i < 5; i++) {
          var timestamp = selectedTimestamps[i];
          var forecastDate = currentDate.add(i+1, 'day').format("M/D/YYYY");
          var icon = data.list[timestamp].weather[0].icon;
          var tempKelvin = data.list[timestamp].main.temp;
          var tempDisplay = ((tempKelvin - 273.15) * 9/5) + 32;
          var windMPS = data.list[timestamp].wind.speed;
          var windDisplay = (windMPS*2.237);
          var humidDisplay = data.list[timestamp].main.humidity;
          
          var dayCard = document.createElement("div");
          dayCard.className = "day-card-content day-card";

          // Add content to the forecast card
          dayCard.innerHTML = `
            <h4 class="title is-4 has-text-white">${forecastDate}</h4>
            <img class="forecast-icon" src="http://openweathermap.org/img/w/${icon}.png">
            <h6 >Temp: ${tempDisplay.toFixed(2)}°F</h6>
            <h6 >Wind: ${windDisplay.toFixed(2)} MPH</h6>
            <h6 >Humidity: ${humidDisplay} %</h6>
          `;

          forecastCards.appendChild(dayCard);
        }
      })
        .catch(function (error) {
          console.error("Error:", error);
        });
    }
  
    //Adds the entered city name to search history
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
  
    //Updates list of search history buttons
    function updateButtonList() {
      buttonList.innerHTML = "";
  
      previousSearches.forEach((searchEntry) => {
        var button = document.createElement("button");
        button.textContent = searchEntry;
        button.classList.add("button");
  
        //Adds event listener to each button for re-searching
        button.addEventListener("click", function () {
          search(searchEntry);
        });
  
        buttonList.appendChild(button);
      });
    }

    // This function logs weather data to the console.
    function logWeatherData(data) {
     console.log("Weather Data:", data);
  }

  
    //Displays current weather data on webpage
    function displayCurrentWeather(data) {
      currentCard.innerHTML = "";
  
      // Creates element for city name and date
      var cityNameElement = document.createElement("h1");
      cityNameElement.className = "title is-3"; 
      cityNameElement.textContent = data.name + " (" + dayjs().format("M/D/YYYY") + ")";
      currentCard.appendChild(cityNameElement);

      // Creates element for weather icon
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
  
    // Event listener for the search button
    searchButton.addEventListener("click", function () {
      var cityName = cityInput.value.trim();
      //Data Validation
      if (cityName === "") {
        alert("Please enter a city name.");
        return;
      }
      else {
      search(cityName);
      addSearchEntry(cityName);
      }
    });
  });
  