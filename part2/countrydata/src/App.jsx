import { useEffect, useState } from 'react'
import axios from 'axios'


const App = () => {
const [value, setValue] = useState('')
const [countries, setCountries] = useState([])

 useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])



const handleChange = (event) => {
  setValue(event.target.value)
}
const filteredCountries = 
value === '' ? [] :
countries.filter(country => 
  country.name.common.toLowerCase().includes(value.toLowerCase()))

const handleShow = (name) => {
  setValue(name)
}

  return (
    <div>
      find countries:<input value={value} onChange={handleChange}/>
      {filteredCountries.length === 1 && (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital?.[0]}</p>
          <p>Population: {filteredCountries[0].population}</p>

          <h3>Languages</h3>
          <ul>
            {Object.values(filteredCountries[0].languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img 
        src={filteredCountries[0].flags.png}
        alt="flag"
        width="150" />
        </div>
      )}

      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShow(country.name.common)}>
                Show</button>
            </li>
          ))
          }
        </ul>
      )}
      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}
    </div>
  )
}

export default App