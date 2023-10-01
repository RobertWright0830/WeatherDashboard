// X clear city after entering in search
//invoke click event when pressing enter on search field


document.addEventListener("DOMContentLoaded", function () {
    var cityInput = document.getElementById("city-input");
    var searchButton = document.getElementById("search-button");
    var buttonList = document.getElementById("buttonList");
    var APIkey = "83b64cc3d3e21c19404a392f83496d54";
  
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
  
    function search(cityName) {
      //Data Validation
      if (cityName.trim() === "") {
        alert("Please enter a city name.");
        return;
      }
  
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        APIkey;
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
          cityInput.value = "";
          updateButtonList();
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
  