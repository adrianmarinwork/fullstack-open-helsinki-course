import { useState, useEffect } from "react";

import personService from "./services/persons";
import NamesFilter from "./components/NamesFilter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  useEffect(function () {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const addName = function (event) {
    event.preventDefault();

    const personFound = persons.find((person) => person.name === newName);

    // If the person exists in our array of persons
    if (personFound) {
      const replaceNumber = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (replaceNumber) {
        personService
          .update(personFound.id, { ...personFound, number: newNumber })
          .then(function (personAdded) {
            const newArrayOfPersons = persons.map((person) =>
              person.id === personAdded.id ? personAdded : person
            );
            setPersons(newArrayOfPersons);

            const newNotificationMessage = "Number updated successfully";
            setNotificationMessage(newNotificationMessage);

            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch(function (error) {
            const newNotificationMessage = `Information of ${newName} has already been removed from server`;
            setNotificationMessage(newNotificationMessage);
            setIsErrorMessage(true);

            setTimeout(() => {
              setNotificationMessage(null);
              setIsErrorMessage(false);
            }, 5000);
          });
      }

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(newPerson)
      .then((person) => setPersons(persons.concat(person)));

    const newNotificationMessage = `Added ${newName}`;
    setNotificationMessage(newNotificationMessage);

    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const onChangeName = function (event) {
    setNewName(event.target.value);
  };

  const onChangeNumber = function (event) {
    setNewNumber(event.target.value);
  };

  const onChangeNameFilter = function (event) {
    setNameFilterValue(event.target.value);
  };

  const onClickDeletePerson = function (person) {
    const deleteUser = confirm(`Delete ${person.name}?`);
    const id = person.id;

    if (!deleteUser) {
      return;
    }

    personService
      .deletePerson(id)
      .then(() => setPersons(persons.filter((per) => per.id !== id)));
  };

  let personsToShow = persons;

  if (nameFilterValue) {
    personsToShow = personsToShow.filter((person) =>
      person.name.includes(nameFilterValue)
    );
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} isError={isErrorMessage} />
      <NamesFilter
        nameFilterValue={nameFilterValue}
        onChangeNameFilter={onChangeNameFilter}
      />
      <h2>Add a New</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        onChangeName={onChangeName}
        newNumber={newNumber}
        onChangeNumber={onChangeNumber}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        onClickDeletePerson={onClickDeletePerson}
      />
    </div>
  );
};

export default App;
