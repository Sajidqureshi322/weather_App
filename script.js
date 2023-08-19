const userTab = document.querySelector("#user-weather");
const searchTab = document.querySelector("#search-weather");
const userContainer = document.querySelector(".user-info-conatiner");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
    
const locationNotFound = document.querySelector("#location-not-found");
let currentTab = userTab; 
const API_KEY = "baf2f9c5e7d1fb9a43a674234ae2836b";
currentTab.classList.add("current-tab");

getFromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");        

        if(!searchForm.classList.contains("active")){
               userContainer.classList.remove("active");
               grantAccessContainer.classList.remove("active");
               searchForm.classList.add("active");
            }
            else{
                searchForm.classList.remove("active");  
                locationNotFound.classList.remove("active");
            // userContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}
userTab.addEventListener("click",() =>{
    switchTab(userTab);
});
searchTab.addEventListener("click",() =>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //grant permission session ko invisible kro 
    grantAccessContainer.classList.remove("active");
    // aur loading screen dikhao
    loadingScreen.classList.add("active");
    //api call
    try{    
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` 
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active")
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        userContainer.classList.remove("active");
        locationNotFound.classList.add("active");
        //yana aur bacha hai
    }
}
function renderWeatherInfo(data){
    // fetching elements
    const cityName = document.querySelector(".city-name");
    const countryIcon = document.querySelector(".image-country-icon");
    const desc = document.querySelector("#data-weather-description");    
    const weatherIcon = document.querySelector("#data-weather-icon");     
    const temp = document.querySelector("#data-temprature");
    const windspeed = document.querySelector("#data-windspeed");
    const humidity = document.querySelector("#data-humidity");
    const cloudiness = document.querySelector("#data-cloudiness"); 

    // fetch values from weather info object 
    console.log(data);
    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText =  `${data?.main?.humidity}%`; 
    cloudiness.innerText = `${data?.clouds?.all}%`;        
}

function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
            //hw -> showing an alert that no geolocation support is available
        }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,  
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)); 
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("#location-grant");
grantAccessButton.addEventListener("click",getLocation)

const searchInput = document.querySelector("#search-input");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;    
   
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();   
        loadingScreen.classList.remove("active");
        // userContainer.classList.add("active");
        // renderWeatherInfo(data);
        if (response.ok) {
            locationNotFound.classList.remove("active");
            userContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            searchForm.classList.remove("active");
            locationNotFound.classList.add("active");
        }
    } catch (err) {
        locationNotFound.classList.add("active");
    }
}