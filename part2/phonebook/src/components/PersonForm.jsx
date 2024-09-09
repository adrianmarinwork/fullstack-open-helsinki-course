const PersonForm = ({
  addName,
  newName,
  onChangeName,
  newNumber,
  onChangeNumber,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={onChangeName} />
      </div>
      <div>
        phone number: <input value={newNumber} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
