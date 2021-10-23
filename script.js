// variables
var inputEl = document.querySelector("input[name=city]");
var btnSearch = document.querySelector("#btnSearch");
var prvCityCont = document.querySelector("#prev-City");
var mainCont = document.querySelector("#mainCont");
var weather = document.querySelector("#weather");
var pastCont = document.querySelector(#pastInputs)
var pastSearches = [];

var apiKey = "966a86c8bd69d14a621d45a4cd70fed2";
var rootURL = "https://api.openweathermap.org/";
var city = "bakersfield";
var countryCode = "US";
var oWGeoURL = rootURL + "geo/1.0/direct?q=" + city + ",US,&limit=1&appid=" + apiKey ;


function startSearch(){
    var pastHistory = localStorage.getitem("previous-searches");
    if(pastHistory) {
        previousSearches = JSON.parse(pastHistory);
    } 
    showHistory();
}

function showHistory(){
    pastCont.innerHTML = "";

    for (var i = pastHistory.length - 1; i >= 0; i --){

        var newBtn = document.createElement("button");

        newBtn.setAttribute("type", "button");

        newBtn.classList("historyBtn","btn-history");

        newBtn.setAttribute("dataSearch",pastSearches[i]);

        newBtn.textContent = pastSearches[i];

        pastCont.append(newBtn);
    }
}


startSearch();
