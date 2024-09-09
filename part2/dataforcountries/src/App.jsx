import { useState, useEffect } from "react";

import countriesService from "./services/countries";
import CountriesSearcher from "./components/CountriesSearcher";
import CountriesList from "./components/CountriesList";
import CountrySelected from "./components/CountrySelected";

function App() {
  const [countryValue, setCountryValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [countrySelected, setCountrySelected] = useState(null);

  useEffect(function () {
    countriesService.getAllCountries().then(function (allCountries) {
      setCountries(allCountries);
    });
  }, []);

  const onChangeCountrySearcher = function (event) {
    const value = event.target.value;
    setCountryValue(value);
    setCountrySelected(null);

    const foundCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );

    if (foundCountries.length === 1) {
      setCountrySelected(foundCountries[0]);
    }
  };

  const onClickShowCountry = function (country) {
    setCountrySelected(country);
  };

  const foundCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(countryValue.toLowerCase())
  );

  return (
    <div>
      <CountriesSearcher
        countryValue={countryValue}
        onChangeCountrySearcher={onChangeCountrySearcher}
      />
      {countrySelected ? (
        <CountrySelected country={countrySelected} />
      ) : (
        <CountriesList
          countries={foundCountries}
          onClickShowCountry={onClickShowCountry}
        />
      )}
    </div>
  );
}

export default App;
