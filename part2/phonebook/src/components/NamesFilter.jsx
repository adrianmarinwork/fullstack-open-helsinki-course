const NamesFilter = ({ nameFilterValue, onChangeNameFilter }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={nameFilterValue} onChange={onChangeNameFilter} />
    </div>
  );
};

export default NamesFilter;
