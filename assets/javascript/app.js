
const locationText = document.querySelector(".location-text");
const weatherImage = document.querySelector(".weather-img");
const weatherDegree = document.querySelector(".weather-degree");
const weatherDescription = document.querySelector(".weather-description");
const windText = document.querySelector(".wind-text");
const rainText = document.querySelector(".rain-text");
const days = document.querySelectorAll(".day");
const hourlyTime = document.querySelectorAll(".hourly-time");
const hourlyDegree = document.querySelectorAll(".hourly-degree");
const weatherImg = document.querySelector(".weather-img");
const cloudImgs = document.querySelectorAll(".cloud-img");
const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clear = document.querySelector(".clear");
const navLocation = document.querySelector(".nav-location");
const errorMsg = document.querySelector(".errorMsg");
const searchInput = document.querySelector(".search-input");
const btn = document.querySelector(".submit-btn");

let dateArr = [ ];
let hourArr = [ ];
let tempArr = [ ];
let fiveHourTemp = [ ];
let fourHourArr = [ ];
let currentImgArr = [ ];
let fiveImgArr = [];
let sortedImgArr = [];


const apiKey = "c7df52cb38394593a2c91554222406";
let apiLink = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=london&days=3&aqi=no&alerts=no`;        



// Function which will clear all values stored in array
const emptyArrays = function(){
        tempArr = [ ];
        fiveHourTemp = [ ];
        fourHourArr = [ ];
        currentImgArr = [ ];
        fiveImgArr = [];
        sortedImgArr = [];
}


// Displaying weather data 
const renderHtml = function(data){
    
        locationText.textContent = data.location.name;
        weatherDegree.innerHTML = `${data.current.temp_c} &deg`;
        weatherDescription.textContent = data.current.condition.text;
        windText.textContent = `${data.current.wind_kph} km/h`;
        rainText.textContent = `${data.current.precip_in} %`;
        if(data.current.is_day === 0){
            weatherImg.src = `/assets/images/Weather_Icons/moon/${data.current.condition.text}.png`;
        }
        else{
            weatherImg.src = `/assets/images/Weather_Icons/sun/${data.current.condition.text}.png`;
        }
}



// This function displays the 3 days (4 hour) from current time dynamically
const displayHours = function(currentHourPos){

    // Slicing the arrays from the next hour of current time and then adding it to a new array this is like kind of sorting 
    const newHourArr = [...hourArr.slice(currentHourPos, hourArr.length), ...hourArr.slice(0,currentHourPos)];
    
    // Looping through the above sorted array and pushing it to another array so that we will get only next four hours time which we can loop through later
    for(let i=0; i<4;i++){
        fourHourArr.push(newHourArr[i])

    }

    // Here we are looping the fourHourArr and displaying it in the web page dynamically
    hourlyTime.forEach((hour,index) => {
        hour.textContent = fourHourArr[index];
    });

}





const displayTemp = function(day,currentHourPos){

    // Looping an arraay named day and getting the temperature from the api which consists of 24 hour's temperature of a day
    day.forEach((temp) => {
        let currTemp = temp.temp_c;
        tempArr.push(currTemp);
    });


    // Slicing the arrays from the next temperature of current time and then adding it to a new array this is like kind of sorting 
    const sortedTempArr = [...tempArr.slice(currentHourPos, tempArr.length), ...tempArr.slice(0,currentHourPos)];


    // Looping through the above sorted array and pushing it to another array so that we will get only next four hours temperature which we can loop through later
    for(let i=0; i<4;i++){
        fiveHourTemp.push(sortedTempArr[i])
    }


    // Here we are looping the fourHourTemp array and displaying the temperature of next four hours it in the web page dynamically
    hourlyDegree.forEach((degree,index) => {
        degree.innerHTML = `${fiveHourTemp[index]} &deg`;
    })

};



// Function to fetch data from api
const fetchApi = async function(api){
   try{ const res = await fetch(api);
    const data = await res.json();
        console.log(data);
        renderHtml(data);
        
        // Getting current time and date
        const time = new Date();

        // this will give something like this ->> Fri Jul 01 2022 19:18:14 GMT+0530 (India Standard Time)


        // This function will then convert this (Fri Jul 01 2022 19:18:14 GMT+0530 (India Standard Time)) to (07:00 PM)
        function formatAMPM(time) {
            var hours = time.getHours();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            hours = hours < 10 ? "0"+hours : hours
            var strTime = hours + ':' + '00' + ' ' + ampm;
             return strTime
          }

        //  Assigning the formatAMPM function to an variable convertedTime
          const convertedTime = formatAMPM(time);


        //   Getting the hourly weather data of current day + the next two days it will be an array
        const currentDayHour = data.forecast.forecastday[0].hour;
        const secondDayHour = data.forecast.forecastday[1].hour;
        const thirdDayHour = data.forecast.forecastday[2].hour;

        // storing the 3 days hourly weather in daysArr
        const daysArr =[currentDayHour, secondDayHour, thirdDayHour]

    
        // This will give an array like this ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
        currentDayHour.forEach((hour) => {
            const currentHour = new Date(`${hour.time}`)
            let hours = currentHour.toLocaleString('en-US', { hour: 'numeric', hour12: true }).split(' ')[0].slice(0,2);
            if(hours < 10){
                hourArr.push("0"+hours);
            }
            else hourArr.push(hours);
        });

        // Adding AM
        for(let i = 0; i < 12;i++){
            hourArr[i] = hourArr[i].slice(0,2) + ":00 AM" + hourArr[i].slice(2);
        }

        // Adding PM
        for(let j = hourArr.length-1;j >= 12;j--){
            hourArr[j] = hourArr[j].slice(0,2) + ":00 PM" + hourArr[j].slice(2);
        }

        // Function to change and display hourly clouds images dynamically
        const displayImg = function(day,currentHourPos){


            day.forEach(hour => {
                let currentImg = hour.condition.text;
                currentImgArr.push(currentImg);
            });
        
            sortedImgArr = [...currentImgArr.slice(currentHourPos, currentImgArr.length), ...currentImgArr.slice(0,currentHourPos)];
            console.log(sortedImgArr);
        
            for(let i=0; i<4;i++){
                fiveImgArr.push(sortedImgArr[i])
            }
        
            console.log(fiveImgArr);
        
            cloudImgs.forEach((img,index) => {
                if(data.current.is_day === 0){
                    img.src =  `./assets/images/Weather_Icons/moon/${fiveImgArr[index]}.png`;
                }
                else{
                    img.src = `./assets/images/Weather_Icons/sun/${fiveImgArr[index]}.png`;
                }
                
            });
        }


        // Getting next hour index position in hourArr
        const currentIndex = hourArr.indexOf(convertedTime);
        const nextIndex = currentIndex + 1;

        // Calling functions
        displayHours(nextIndex);
        displayTemp(currentDayHour ,nextIndex);
        displayImg(currentDayHour,nextIndex);


        const generateDay = function(date){
            const d = new Date(`${date}`);
            // console.log(d);
            const comingDays = `${d.toString().split(' ')[0]}, ${d.toString().split(' ')[2]} ${d.toString().split(' ')[1]}`;
            // This will give the today + next 2 days date (Fri, 01 Jul, Sat, 02 Jul, Sun, 03 Jul)
            dateArr.push(comingDays);
        }


        const daysWeather = data.forecast.forecastday;
        daysWeather.forEach(day =>{
            generatedDate = generateDay(day.date);
        });
       

        days.forEach((day,index) => {
            day.textContent = `${dateArr[index]}`
            day.addEventListener("click", function(){

                displayImg(daysArr[index],nextIndex);
                displayTemp(daysArr[index],nextIndex);
                emptyArrays();

            })
        })
    
        days.forEach((day,_,buttons) => {
            day.addEventListener("click", function(){
                buttons.forEach(button => button.classList.toggle("activeDay",button === day))
            })
        })
        

        // After fetching and displaying all the data in the web page emptying all the arrays
        hourArr = [ ];
        emptyArrays();
    } catch(err){
        console.error(err.message)
    }
    // .catch(err => console.log(err));   
}


// Getting User Location using Geolocation API and displaying user's current location weather 
const options = {
    enableHighAccuracy: true,
}
navigator.geolocation.getCurrentPosition(function(position){
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    console.log(lat,long);
    apiLink = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${long}&days=3&aqi=no&alerts=no`
    fetchApi(apiLink);
},function(){
    console.log("Failed to get location");
},options);


// By default this function will fetch London weather if the user denies the location access
fetchApi(apiLink);


// Function to add and remove the classes
const addClass = function(){
    navLocation.classList.toggle("active");
    search.classList.toggle("active");
    clear.classList.toggle("active");
};


clear.addEventListener("click",function(){
    document.querySelector(".search-input").value = "";
    navLocation.classList.toggle("active");
    search.classList.toggle("active");
    clear.classList.toggle("active");
})




// Searching and displaying whether report of user input location
icon.addEventListener("click",function(){
    if(!searchInput.value){
        addClass();
    }
    else{
        addClass();
        let searchValue = searchInput.value
        let searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`
        fetchApi(searchApi);
        searchInput.value= "";
    }
    
})


// On enter key to find user's location
searchInput.addEventListener("keydown",function(e){
    console.log(typeof(searchInput.value));
    if(e.keyCode == 13){
        e.preventDefault()
        addClass();
        const searchValue = searchInput.value
        const searchApi = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchValue}&days=3&aqi=no&alerts=no`;
        fetchApi(searchApi);
        searchInput.value= "";
    }
    else{
        return
    }
})





