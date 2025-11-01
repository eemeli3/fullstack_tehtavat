import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({weatherInfo}) => { // Display weather information
  if (weatherInfo.temperature && weatherInfo.wind && weatherInfo.weatherSymbol) {
    return (
      <div>
        <div>Temperature {weatherInfo.temperature.toFixed(1)} Celsius</div>
        <img src={weatherInfo.weatherSymbol} />
        <div>Wind {weatherInfo.wind.toFixed(1)} m/s</div>
      </div>
    )
  } else {
    return(
      <div>Cannot retrieve weather information</div>
    )
  }
}

const Country = ({countryInfo, weatherInfo}) => { // Display information for selected country
  return (
    <div>
      <h1>{countryInfo.name}</h1>
      <div>Capital {countryInfo.capital}</div>
      <div>Area {countryInfo.area}</div>
      <h1>Languages</h1>
      <ul>
        {countryInfo.languages.map( element => <li key={element}>{element}</li>)}
      </ul>
      <img src={countryInfo.flag} />
      <h1>Weather in {countryInfo.capital}</h1>
      <Weather weatherInfo={weatherInfo} />
    </div>
  )
}

const Countries = ({filteredCountries, countryInfo, weatherInfo, forceShowCountry, handleClick}) => { // Display content
  if (filteredCountries.length === 1 || forceShowCountry) {
    return (
      <Country countryInfo={countryInfo} weatherInfo={weatherInfo} />
    )
  }
  else if (filteredCountries.length > 10) {
      return (
        <div>Too many matches, specify another filter</div>
      )
    }
  else if (filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map(element => <div key={element}>{element} <button onClick={() => handleClick(element)}>Show</button></div>)}
      </div>
    )
  }
  else {
    return (
      <div>No countries found</div>
    )
  }
}

function App() {
  const [filterString, setFilterString] = useState('') // string used for searching countries
  const [filteredCountries, setFilteredCountries] = useState([]) // list of countries that fir filterString
  const [forceShowCountry, setForceShowCountry] = useState(false) // flag for showing country information even if multiple countries fit filterString
  const [countryInfo, setCountryInfo] = useState(// basic information for selected country
    {
      name: "",
      capital: "",
      area: 0,
      languages: [],
      flag: null,
    }
  )
  const [weatherInfo, setWeatherInfo] = useState(// weather information for selected country
    {
      temperature: null,
      wind: null,
      weatherSymbol: null
    }
  )

  const getCountryInfo = (country) => { // get basic information for selected country
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country.toLowerCase()}`).then(response => response.data)
      .then(response => {
        const languages = []
        for (const property in response.languages) {
          languages.push(response.languages[property])
        }
        setCountryInfo({
          name: response.name.common,
          capital: response.capital[0],
          area: response.area,
          languages: languages,
          flag: response.flags.png,
        })
      })
  }

  useEffect(() => { // update filteredCountries when filterString changes
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => response.data)
      .then(response => response.map(element => element.name.common))
      .then(response => response.filter(
        element => element.toLowerCase().includes(filterString.toLowerCase())
      ))
      .then(response => setFilteredCountries(response))
  }, [filterString])

  useEffect(() => {// update countryInfo when filteredCountries changes
    if (filteredCountries.length === 1) {
      getCountryInfo(filteredCountries[0])
    }
  }, [filteredCountries])

  useEffect(() =>{// update weatherInfo when countryInfo changes
    if (countryInfo.capital !== "") {
      try {
        const api_key = import.meta.env.VITE_SOME_KEY
        const weatherInfo = axios.get("http://api.weatherapi.com/v1/current.json", { params: { key: api_key, q: countryInfo.capital } }).then(response => response.data.current)
        weatherInfo.then(response => {
          setWeatherInfo({
            temperature: response.temp_c,
            wind: response.wind_kph*1000/60/60,
            weatherSymbol: response.condition.icon
          })
        }).catch(error => {
          console.log("Cannot get weather information from WeatherAPI.com. Check that API key is correct.")
          setWeatherInfo({
            temperature: null,
            wind: null,
            weatherSymbol: null
          })
        })
      } catch {
        console.log("Cannot import API KEY. Please start vite with the command: 'export VITE_SOME_KEY=MY_API_KEY && npm run dev' where MY_API_KEY is the api key to WeatherAPI.com")
      }
    }
  }, [countryInfo.capital])

  const handleFilterStringChange = (event) => {// handle user changing filterString
    setFilterString(event.target.value)
    setForceShowCountry(false)
  }

  const handleClick = (country) => {// handle "Show" button click
    getCountryInfo(country)
    setForceShowCountry(true)
  }

  return(
    <div>
      <div>find countries <input type="search" value={filterString} onChange={handleFilterStringChange} /></div>
      <Countries filteredCountries={filteredCountries} countryInfo={countryInfo} weatherInfo={weatherInfo} forceShowCountry={forceShowCountry} handleClick={handleClick}/>
    </div>
  )
}

export default App
