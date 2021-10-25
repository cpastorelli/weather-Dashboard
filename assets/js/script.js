// variables
var inputEl = document.querySelector('input[name="cityName"]');
var btnSearch = document.querySelector("#btnSearch");
var prvCityCont = document.querySelector("#prev-City");
var mainCont = document.querySelector("#mainCont");
var weather = document.querySelector("#weather");
var formInput = document.querySelector("form");
var pastSearches = [];


var apiKey = "966a86c8bd69d14a621d45a4cd70fed2";
var rootURL = "https://api.openweathermap.org/";

var countryCode = "US";
//var oWGeoURL = rootURL + "geo/1.0/direct?q=" + city + ",US,&limit=5&appid=" + apiKey ;


// 
function getWeather(city){
    mainCont.innerHTML = "";
    weather.innerHTML = "";

    var cityURL ="https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + apiKey;

  fetch(cityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var citydata = data[0];
      console.log(citydata);
      var weatherURL ="https://api.openweathermap.org/data/2.5/onecall?lat=" + citydata.lat + "&lon=" + citydata.lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

      fetch(weatherURL)
        .then(function (response) {
          return response.json();
        })
        
        .then(function (wData) {
          
            var cityName = document.createElement("h2");
            cityName.className = "card-header bg-secondary bg-gradient ";
            cityName.textContent = city.toUpperCase() + " "+  moment.unix(wData.current.sunrise).format("DD/MM/YYYY");
            
            var iWeather = document.createElement("img");
            iWeather.setAttribute("src", "https://openweathermap.org/img/w/" + wData.current.weather[0].icon + ".png");
            
            cityName.append(iWeather);
            mainCont.append(cityName);

          
            var weatherNode = document.createElement("ul");
            weatherNode.className = "list-group";

            var temperature = document.createElement("li");
            temperature.textContent = "temperature: " + wData.current.temp + "\u00B0F";
            temperature.className = "list-group-item rounded";   
            weatherNode.append(temperature);

            var wind = document.createElement("li");
            wind.textContent = "Wind speed: " + wData.current.wind_speed + " mph";
            wind.className = "list-group-item";   
            weatherNode.append(wind);

          
            var humidity = document.createElement("li");
            humidity.textContent = "Humidty: " + wData.current.humidity + "%";
            humidity.className = "list-group-item rounded";   
            weatherNode.append(humidity);

          
            var uvIndex = document.createElement("li");
            uvIndex.textContent = "UV index: " + wData.current.uvi;
            uvIndex.className = "list-group-item rounded";   
            weatherNode.append(uvIndex);

            mainCont.append(weatherNode); 

            var wTitle = document.createElement("h2");
            wTitle.textContent = "Weather Forecast for the next 5 days:";
            wTitle.className = "card-title";

            weather.append(wTitle);

            for(var i = 0; i < wData.daily.length; i ++){
                var dayX = wData.daily[i];
                var dayXList = document.createElement("ul");
                dayXList.className = "card-body bg-info bg-gradient bg-opacity-50 border border-dark"
                var date = moment.unix(dayX.sunrise).format("DD-MM-YYYY");
              

                dayXList.append(date);

                var icon = document.createElement("img");
                icon.setAttribute("src", rootURL + "/img/w/" + dayX.weather[0].icon + ".png");
                //icon.className = "card-img-top";
                dayXList.append(icon);

                var temperature = document.createElement("li");
                temperature.textContent = "Temperature: "+ dayX.temp.day + "\u00B0F";
                temperature.className = "list-group-item rounded";
                dayXList.append(temperature);

                var wind = document.createElement("li");        
                wind.textContent = "Wind: " + dayX.wind_speed +" MPH";  
                wind.className = "list-group-item rounded";   
                dayXList.append(wind);

                var humidity = document.createElement("li");   
                humidity.textContent ="Humidity: " + dayX.humidity + "%";     
                humidity.className = "list-group-item rounded";
                dayXList.append(humidity);
 
                weather.append(dayXList);
            }
        
        });

    })
}


function showHistory(){
  
for (var i = 0; i < pastSearches.length; i++){
    
    const pastCities = pastSearches[i];
    var newBtn = document.createElement("button");

    newBtn.textContent = pastCities;
    newBtn.setAttribute("dataVals", pastCities);
   
    newBtn.addEventListener("submit", function () {
        console.log("I am in the EventListener function within showHistory");
        var searchCity = this.getAttribute("dataVals");
        getWeather(searchCity);
      });

      prvCityCont.appendChild(newBtn);
}

console.log(pastSearches);
localStorage.setItem("previousSearches", JSON.stringify(pastSearches));
}

formInput.addEventListener("submit", function(e) {
    e.preventDefault();
    
    var srchVal = inputEl.value.trim();
  
    if (!srchVal) {
      return;
    }

    document.getElementById("hideme").classList.remove("visually-hidden");
  
    pastSearches.push(srchVal);
    getWeather(srchVal);
    showHistory();
  });

// 

// 
function startSearch(){
    
    var pastHistory = localStorage.getItem("previousSearches");

    if(pastHistory) {
        console.log("There were previous searches made");
        previousSearches = JSON.parse(pastHistory);
        showHistory();
    } 
}



// 
startSearch();