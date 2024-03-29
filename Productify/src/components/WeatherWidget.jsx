import React, { useState, useEffect } from "react";
import "./weatherwidget.css";
function WeatherWidget({ widgetId, removeWidget }) {
  const [city, setCity] = useState("New York"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchWeatherData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }`
        );

        if (!response.ok) {
          console.error("Error fetching weather data:", response.statusText);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!ignore) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (city.trim() !== "") {
      fetchWeatherData();
    } else {
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [city]);

  return (
    <div className="Widget">
      <h2>Weather</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      {loading && <div>Loading...</div>}
      {!loading && weatherData && (
        <div>
          <p>City: {weatherData.name}</p>
          <p>
            Temperature:{" "}
            {(((weatherData.main.temp - 273.15) * 9) / 5 + 32).toFixed(2)} °F
          </p>
          <p>
            Description:{" "}
            {weatherData.weather[0].description.charAt(0).toUpperCase() +
              weatherData.weather[0].description.slice(1)}
          </p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
        </div>
      )}
      <button onClick={() => removeWidget(widgetId)} className="RemoveButton">
        Remove
      </button>
    </div>
  );
}

export default WeatherWidget;
