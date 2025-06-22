import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [localTime, setLocalTime] = useState('');
  const [localDate, setLocalDate] = useState('');
  const [backgroundClass, setBackgroundClass] = useState('default');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const updateTimeAndDate = (timezone) => {
    const localTimeMs = Date.now() + new Date().getTimezoneOffset() * 60000 + timezone * 1000;
    const localDateObj = new Date(localTimeMs);

    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    setLocalTime(localDateObj.toLocaleTimeString('en-US', timeOptions));
    setLocalDate(localDateObj.toLocaleDateString('en-US', dateOptions));
  };

  const updateBackground = (iconCode) => {
    if (iconCode.includes('01')) {
      setBackgroundClass('sunny');
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      setBackgroundClass('cloudy');
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
      setBackgroundClass('rainy');
    } else if (iconCode.includes('13')) {
      setBackgroundClass('snowy');
    } else {
      setBackgroundClass('default');
    }
  };

  const search = async (city) => {
    if (!city || city.trim() === '') {
      alert("Enter City Name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "City not found");
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.round(data.main.temp),
        location: data.name,
        icon: icon,
      });

      updateTimeAndDate(data.timezone);
      updateBackground(data.weather[0].icon);

    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Something went wrong while fetching data.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  useEffect(() => {
    // No default city on load
  }, []);

  return (
    <div className={`weather-container ${backgroundClass}`}>
      <div className="weather-box">
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city"
            onKeyDown={handleKeyPress}
          />
          <img
            src={search_icon}
            alt="Search"
            className="search-icon"
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {weatherData && (
          <>
            <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}&deg;C</p>
            <p className="location">{weatherData.location}</p>
            <p className="datetime">{localTime}<br />{localDate}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Wind" />
                <div>
                  <p>{weatherData.windSpeed} Km/hr</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Weather;
