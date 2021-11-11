// variables
const inputEl = document.querySelector('input[name="cityName"]');
const btnSearch = document.querySelector("#btnSearch");
const pastBtn = document.querySelector(".cityLookup");
const pastEl = document.querySelector("#prev-City");
const mainCont = document.querySelector(".mainCont");
const weather = document.querySelector(".weatherCont");
const formInput = document.querySelector("form");

var pastSearches = [];
const apiKey = "966a86c8bd69d14a621d45a4cd70fed2";
const rootURL = "https://api.openweathermap.org/";
const countryCode = "US";

// const liClass = "list-group-item rounded";
// const tArray1 = ["Temp: ", "today.current.temp", "\u00B0F"];
// const tArray2 = ["Temp: ", "today.temp.day", "\u00B0F"];
// const wArray1 = ["Wind: ", "today.current.wind_speed", "MPH"];
// const wArray2 = ["Wind: ", "today.wind_speed", "MPH"];
// const hArray1 = ["Humidity: ", "today.current.humidity", "%"];
// const hArray2 = ["Humidity: ", "today.humidity", "%"];
// const uvArray = ["UV Index: ", "today.current.uvi", " "];

// Begin Program
startSearch();

// Looks for past searches in localStorage
function startSearch(){
  let pastHistory = localStorage.getItem("previousSearches");
  
  if(pastHistory) { 
     let previousSearches = JSON.parse(pastHistory); 
     showHistory(previousSearches); 
  } 
}

// loops through previous searches and creates buttons for searches
function showHistory(past){

  for (let i = 0; i < past.length; i++){
    let pastCities = past[i];
    createBtn(pastCities);
  }
}

// Creates button for city searches
function createBtn(city){
  let newBtn = document.createElement("button");
  newBtn.className = "cityLookup btn-info";
  newBtn.textContent = city;
  pastEl.appendChild(newBtn);

  newBtn.addEventListener("click", function () {
    

    pastSearches.push(city); 
    localStorage.setItem("previousSearches", JSON.stringify(pastSearches));
    
    geolocationAPI(city);
    document.getElementById("hideme").classList.remove("visually-hidden"); 
  });
}

formInput.addEventListener("submit", function(e) {
  e.preventDefault();
  let srchVal = inputEl.value.trim(); 

  if (!srchVal) {
    return;
  }  

   

  pastSearches.push(srchVal); 
  localStorage.setItem("previousSearches", JSON.stringify(pastSearches));

  createBtn(srchVal);
  geolocationAPI(srchVal);
  document.getElementById("hideme").classList.remove("visually-hidden");
  
});

function geolocationAPI(city){
    
  mainCont.innerHTML = "";  
  weather.innerHTML = "";
  let cityURL ="https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + apiKey;
  
  fetch(cityURL)
    
  .then(function (response) { 
    return response.json();
  })

  .then(function (data) {
    let citydata = data[0];
    let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + citydata.lat + "&lon=" + citydata.lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
      
    weatherAPI(weatherURL, city);
    // localStorage.getItem("previousSearches", JSON.stringify(pastSearches));
  })
}

function weatherAPI(weatherURL, city){
  fetch(weatherURL)
  .then(function (response) {
    return response.json();
  })
  
  .then(function(wData) {
    
    let cityName = document.createElement("h2");
    cityName.className = "card-header bg-secondary bg-gradient ";
    cityName.textContent = city.toUpperCase() + " " +  moment.unix(wData.current.sunrise).format("DD/MM/YYYY");
      
    let iWeather = document.createElement("img");
    iWeather.setAttribute("src", "https://openweathermap.org/img/w/" + wData.current.weather[0].icon + ".png");
      
    cityName.append(iWeather);
    mainCont.append(cityName);
    
    let weatherNode = document.createElement("ul");
    weatherNode.className = "list-group shadow";
  //  let newLi = createList(wData, liClass, tArray1);
  //   weatherNode.append(newLi);
    let temperature = document.createElement("li");
    temperature.textContent = "temperature: " + wData.current.temp + "\u00B0F";
    temperature.className = "list-group-item rounded";   
    weatherNode.append(temperature);
   //let newLi = createList(wData, liClass, wArray1);
   //  weatherNode.append(newLi);
    let wind = document.createElement("li");
    wind.textContent = "Wind speed: " + wData.current.wind_speed + " mph";
    wind.className = "list-group-item rounded";   
    weatherNode.append(wind);
   //let newLi = createList(wData, liClass, hArray1);
   //  weatherNode.append(newLi);
    let humidity = document.createElement("li");
    humidity.textContent = "Humidty: " + wData.current.humidity + "%";
    humidity.className = "list-group-item rounded";   
    weatherNode.append(humidity);
   //let newLi = createList(wData, liClass, uvArray);
   // weatherNode.append(newLi);
    let uvIndex = document.createElement("li");
    uvIndex.textContent = "UV index: " + wData.current.uvi;
    uvIndex.className = "list-group-item rounded";   
    weatherNode.append(uvIndex);

    mainCont.append(weatherNode); 
    forecast5Day(wData);
  });
}

function forecast5Day(wData){
  let wTitle = document.createElement("h2");
  wTitle.textContent = "Forecast for the week:";
  wTitle.className = "card-title";
  weather.append(wTitle);
 
  for(let i = 1; i < wData.daily.length; i ++){
    let dayX = wData.daily[i];
    let dayXCard = document.createElement("div");
    dayXCard.className = "card-body bg-info bg-gradient bg-opacity-50 border border-dark cardItem shadow";
    let date = moment.unix(dayX.sunrise).format("DD-MM-YYYY");
  
    dayXCard.append(date);

    let icon = document.createElement("img");
    icon.setAttribute("src", rootURL + "/img/w/" + dayX.weather[0].icon + ".png");
    icon.setAttribute("alt", dayX.weather[0].description);
    dayXCard.append(icon);
    
    let dayXList = document.createElement("ul");
    dayXList.className = "text-center";
    
   //let newLi = createList(dayX, liClass, tArray2);
   // dayxList.append(newLi);
    let temperature = document.createElement("li");
    temperature.textContent = "Temperature: "+ dayX.temp.day + "\u00B0F";
    temperature.className = "list-group-item rounded";
    dayXList.append(temperature);
   //let newLi = createList(dayX, liClass, wArray2);
   // dayxList.append(newLi);
    let wind = document.createElement("li");        
    wind.textContent = "Wind: " + dayX.wind_speed +" MPH";  
    wind.className = "list-group-item rounded";   
    dayXList.append(wind);
   //let newLi = createList(dayX, liClass, hArray2);
   // dayxList.append(newLi);
    let humidity = document.createElement("li");   
    humidity.textContent ="Humidity: " + dayX.humidity + "%";     
    humidity.className = "list-group-item rounded";
    dayXList.append(humidity);

    dayXCard.append(dayXList);
    weather.append(dayXCard);
  }
}

// function createList(thisDay, clName, thisArray){
//   let today = thisDay;
//   console.log(today);
//   let listEl = document.createElement("li");   
//   console.log(thisArray);
//   listEl.textContent = thisArray[0] + thisArray[1] + thisArray[2] ;     
//   listEl.className = clName;
//   console.log(listEl);
//   return listEl;
// }