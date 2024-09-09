const PersonElement = ({ person, onClickDeletePerson }) => {
  return (
    <>
      <p>
        {person.name} {person.number}{" "}
        <button onClick={() => onClickDeletePerson(person)}>Delete</button>
      </p>
    </>
  );
};

const Persons = ({ personsToShow, onClickDeletePerson }) => {
  return (
    <>
      {personsToShow.map((person, index) => (
        <PersonElement
          key={index}
          person={person}
          onClickDeletePerson={onClickDeletePerson}
        />
      ))}
    </>
  );
};

export default Persons;
