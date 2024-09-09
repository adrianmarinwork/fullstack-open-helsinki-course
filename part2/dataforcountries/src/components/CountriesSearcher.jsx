function CountriesSearcher({ countryValue, onChangeCountrySearcher }) {
  return (
    <div>
      Find Countries:{" "}
      <input
        type="text"
        value={countryValue}
        onChange={onChangeCountrySearcher}
      />
    </div>
  );
}

export default CountriesSearcher;
