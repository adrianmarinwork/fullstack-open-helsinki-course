function CountryElement({ country, onClickShowCountry }) {
  return (
    <>
      <p>
        {country.name.common}{" "}
        <button onClick={() => onClickShowCountry(country)}>Show</button>
      </p>
    </>
  );
}

function CountriesList({ countries, onClickShowCountry }) {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  return (
    <div>
      {countries.map((country, index) => (
        <CountryElement
          key={index}
          country={country}
          onClickShowCountry={onClickShowCountry}
        />
      ))}
    </div>
  );
}

export default CountriesList;
