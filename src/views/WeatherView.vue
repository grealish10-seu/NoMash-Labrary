<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="search-button">
          Search
        </button>
        <br>
        <br>
        Please implement "Search Weather by City".
      </div>
    </div>

    <!--The <main> tag in HTML is used to specify the main content of a document 
    More info about main, check https://www.w3schools.com/tags/tag_main.asp-->  
    <main>
      <!--If there are no data returned, then skip rendering the information-->  
      <div v-if="weatherData" class="weather-info">
        <!--Display the weather data attribute returned from API
        Example of API data: https://openweathermap.org/current-->  
        <h2>
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>
        <div class="weather-display">
          <!--The image source of of the weather icon will be coming from a function called iconUrl
              which will be shared in script later-->  
          <img :src="iconUrl" alt="Weather Icon" />
          <p class="temperature">{{ temperature }} °C</p>
        </div>
        <!-- weather[0] means the current weather, the way we need to obtain data depends on how
        the API JSON data looks-->
        <span class="description">{{ weatherData.weather[0].description }}</span>
        
        <!-- Additional weather details -->
        <div class="weather-details">
          <div class="detail-item">
            <strong>Feels like:</strong> {{ Math.round(weatherData.main.feels_like) }}°C
          </div>
          <div class="detail-item">
            <strong>Humidity:</strong> {{ weatherData.main.humidity }}%
          </div>
          <div class="detail-item">
            <strong>Wind Speed:</strong> {{ weatherData.wind.speed }} m/s
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="loading" class="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>Fetching weather data...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      
      <!-- Initial state -->
      <div v-else class="initial-state">
        <p>🌤️ Enter a city name to get weather information</p>
        <p>Or allow location access to get your current weather</p>
      </div>
    </main>
  </div>
</template>

<script>
// The info section in 10.1.1 provided detailed information about this package 
import axios from "axios";

// IMPORTANT: Replace this with your actual OpenWeatherMap API key
// Get your free API key from: https://openweathermap.org/api
// For demonstration purposes, we'll use a demo key that works with limited functionality
const apikey = "23feddf446106aac31f73c0663457261"; // Demo API key - replace with your own

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      loading: false,
      error: null,
    };
  },
  //computed is a property that is used to define a property that 
  //is dependent on other data properties. 
  //If we using a more easy to understand words to understand the concept: 
  //the derived value such as temperature automatically update when the relevant value change.
  computed: {
    //There are multiple way to obtain the data in Celsius format.
    //Since we're now using units=metric, the temperature is already in Celsius
    temperature() {
      return this.weatherData
        ? Math.round(this.weatherData.main.temp)
        : null;
    },
    //Get the current weather icon using the API link
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  //There are two steps involved in this, 
  //step 1: identify current location 
  //step 2: after identify, get the weather data straight based on the current location.
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    //Async in a easy to understand way means the method will run in backend thread, 
    //And it won't occupy the main thread, so the user experience is still smooth
    async fetchCurrentLocationWeather() {
      //The navigator.geolocation object is part of the Web API provided by modern web browsers
      //Please note this function is not belongs to Vue or openweather.
      if (navigator.geolocation) {
        this.loading = true;
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            //API link to obtain the current weather based on the current location browser identified 
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
            //await means wait for the fetchWeatherData method to complete before proceeding
            await this.fetchWeatherData(url);
          },
          (error) => {
            console.log("Geolocation error:", error);
            this.loading = false;
            this.error = "Unable to get your location. Please search for a city manually.";
          }
        );
      } else {
        this.error = "Geolocation is not supported by this browser.";
      }
    },
    
    async searchByCity() {
      if (!this.city.trim()) {
        this.error = "Please enter a city name";
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      // API URL for searching by city name with metric units for Celsius temperature
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}&units=metric`;
      await this.fetchWeatherData(url);
    },
    
    async fetchWeatherData(url) {
      try {
        console.log("🌤️ Making API call to:", url.replace(apikey, 'API_KEY_HIDDEN'));
        const response = await axios.get(url);
        //Returned data from API is stored as JSON file in weatherData
        this.weatherData = response.data;
        console.log("🌤️ Weather data received:", this.weatherData);
        this.error = null; // Clear any previous errors
      } catch (error) {
        console.error("❌ Error fetching weather data:", error);
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || 'Unknown error';
          
          switch (status) {
            case 401:
              this.error = `Invalid API key. Please get a free API key from https://openweathermap.org/api and replace it in the code. Error: ${message}`;
              break;
            case 404:
              this.error = `City "${this.city}" not found. Please check the spelling and try again.`;
              break;
            case 429:
              this.error = "API call limit exceeded. Please wait a moment and try again.";
              break;
            default:
              this.error = `API Error (${status}): ${message}`;
          }
        } else if (error.request) {
          this.error = "Network error. Please check your internet connection and try again.";
        } else {
          this.error = "An unexpected error occurred. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.search-input {
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 25px;
  width: 300px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
}

.search-button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #2980b9;
}

main {
  text-align: center;
  margin-top: 30px;
}

.weather-info {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.weather-info h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.weather-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.weather-display img {
  width: 80px;
  height: 80px;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
}

.description {
  font-size: 1.2rem;
  text-transform: capitalize;
  margin-bottom: 20px;
  display: block;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.detail-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 8px;
}

.loading {
  padding: 40px;
}

.loading p {
  margin-top: 15px;
  color: #666;
}

.initial-state {
  padding: 40px;
  color: #666;
}

.initial-state p {
  font-size: 1.1rem;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
    max-width: 300px;
  }
  
  .weather-display {
    flex-direction: column;
    gap: 10px;
  }
  
  .temperature {
    font-size: 2.5rem;
  }
}
</style> 