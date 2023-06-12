var islamicCountries = [
    "Saudi Arabia",
    "Iran",
    "Pakistan",
    "Egypt",
    "Indonesia",
    "Turkey",
    "United Arab Emirates",
    "Bangladesh",
    "Morocco",
    "Algeria"
  ];
let citiesByCountry = {
    "Saudi Arabia": ["Mecca","Riyadh", "Jeddah","Medina", "Dammam"],
    "Iran": ["Tehran", "Mashhad", "Isfahan", "Tabriz", "Shiraz"],
    "Pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
    "Egypt": ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Luxor"],
    "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Bali"],
    "Turkey": ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah"],
    "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"],
    "Morocco": ["Casablanca", "Marrakech", "Fez", "Rabat", "Agadir"],
    "Algeria": ["Algiers", "Oran", "Constantine", "Annaba", "Tlemcen"]
} 

let countryDropDown = document.getElementById('countryDropDown');
let countryOptions = '';
let cityDropDwon = document.getElementById('cityDropdown');
let cityOptions = '';
let btn = document.getElementById('btn');
let tbody = document.getElementById('tbody');
let table = '';
const axios = require('axios');

// show the counties in the html
function showCounties(){
    islamicCountries.forEach((islamicCountry)=>{
        countryOptions += `<option class="CountryOptions" value="${islamicCountry}">${islamicCountry}</option>`
    })
    countryDropDown.innerHTML = countryOptions;
}
showCounties();


// show the cities by the country 
function showCity(){
    cityOptions = '';
    let cities = citiesByCountry[countryDropDown.value];
    cities.forEach((city) =>{
        cityOptions += `<option>${city}</option>`
    })
    cityDropDwon.innerHTML = cityOptions;
}
showCity()


// event Listener to show the cities of an selected country
countryDropDown.addEventListener('change' , showCity)



function showPrayerTimeByCity(country , city){
    table = '';
    axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`)
        .then((response)=>{
            let timing = response.data.data.timings;
            let date = response.data.data.date.hijri;
            table += `<tr>
                        <td class="city">${city}</td>
                        <td>${timing["Fajr"]} AM</td>
                        <td>${timing["Sunrise"]} AM</td>
                        <td>${timing["Dhuhr"]} PM</td>
                        <td>${timing["Asr"]} PM</td>
                        <td>${timing["Maghrib"]} PM</td>
                        <td>${timing["Isha"]} PM</td>
                    </tr>`
            tbody.innerHTML = table;
            document.getElementById('date').innerHTML = `${date["day"]} ${date.month["en"]} , ${date.year} hijri`
            document.getElementById('cityLocation').innerHTML = `${city}`
        })
        .catch((error) => {
            document.body.innerHTML = `<div class="divOfError"><h1 class="error">404</h1>
            <p>sorry the api doesn't work</p></div> `
        })
}

function getMyLocation(){
    const succes = (position) =>{
        const latitude = position.coords.latitude; 
        const longitude = position.coords.longitude; 
        axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`)
            .then((response)=>{
                showPrayerTimeByCity(response.data["countryName"] , response.data["city"])
            })
    }
    const error = () => {
        showPrayerTimeByCity("Saudi Arabia" , "Mecca");
    }
    navigator.geolocation.getCurrentPosition(succes , error);
}
getMyLocation();