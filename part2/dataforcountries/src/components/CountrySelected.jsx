function CountrySelected({ country }) {
  if (!country.name) {
    return <></>;
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <p>Languages:</p>
      <ul>
        {Object.keys(country.languages).map((language, index) => (
          <li key={index}>{country.languages[language]}</li>
        ))}
      </ul>
      <img src={country.flags.svg} />
    </div>
  );
}

export default CountrySelected;
