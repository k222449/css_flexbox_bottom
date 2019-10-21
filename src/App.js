import React, { useState, useCallback } from 'react';
import {
  NormalPeoplePicker,
  ValidationState,
} from 'office-ui-fabric-react/lib/Pickers';
import { Button, InputGroup } from '@blueprintjs/core';
import { ReactComponent as TimeIcon } from './passage-of-time.svg';
import './App.css';

function App() {
  const [peopleList, setPeopleList] = useState(() => []); // This state stores recommend people list
  const [selectedPeople, setSelectedPeople] = useState(() => []); // This state store slected people
  const [mostRecentlyUsed, setMru] = useState(() => []); // stores most recent used peoplessaz
  const suggestionProps = { // IBasePickerSuggestionsProps
    suggestionsHeaderText: 'Suggested_people',
    noResultsFoundText: 'no_result',
    loadingText: 'loading...',
    showRemoveButtons: true,
  };

  const filterPromise = (personasToReturn) => personasToReturn;

  const doesTextStartWith = (text, filterText) => text.toLowerCase()
    .indexOf(filterText.toLowerCase()) === 0;

  const filterPersonasByText = useCallback((filterText) => peopleList
    .filter((item) => doesTextStartWith(item.text, filterText)), [peopleList]);

  const listContainsPersona = (persona, personas) => {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter((item) => item.text === persona.text).length > 0;
  };

  const removeDuplicates = useCallback((personas, possibleDupes) => personas
    .filter((persona) => !listContainsPersona(persona, possibleDupes)), []);

  const onFilterChanged = useCallback((
    filterText,
    currentPersonas,
    limitResults,
  ) => {
    if (filterText) {
      let filteredPersonas = filterPersonasByText(filterText);
      filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
      return filterPromise(filteredPersonas);
    }
    return peopleList;
  }, [filterPersonasByText, peopleList, removeDuplicates]);

  // getTextFromItem - Select highlighted user
  // function getTextFromItem(persona) {
  //   return persona.text
  // }

  // remove people
  const onRemoveSuggestion = useCallback((item) => {
    const indexPeopleList = peopleList.indexOf(item);
    const indexMostRecentlyUsed = mostRecentlyUsed.indexOf(item);
    if (indexPeopleList >= 0) {
      const newPeople = peopleList.slice(0, indexPeopleList)
        .concat(peopleList.slice(indexPeopleList + 1));
      setPeopleList(newPeople);
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople = mostRecentlyUsed
        .slice(0, indexMostRecentlyUsed)
        .concat(mostRecentlyUsed.slice(indexMostRecentlyUsed + 1));
      setMru(newSuggestedPeople);
    }
  }, [mostRecentlyUsed, peopleList]);

  const validateInput = useCallback((input) => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } if (input.length > 1) {
      return ValidationState.warning;
    }
    return ValidationState.invalid;
  }, []);

  return (
    <div className="App">
      <div className="wrapper">
        <Button text="fire enter" icon="add" />
        <TimeIcon />
        <NormalPeoplePicker
          // onRenderSuggestionsItem={examplePersona}
          onResolveSuggestions={onFilterChanged}
          // getTextFromItem={selectedPeople}
          pickerSuggestionsProps={suggestionProps}
          className="compose-picker" // ms-peoplepicker
          onRemoveSuggestion={onRemoveSuggestion}
          onValidateInput={validateInput}
          selectedItems={selectedPeople}
          onChange={setSelectedPeople}
          onBlur={onFilterChanged}
        />
      </div>
      <div className="input-group-flex-end">
        <InputGroup />
      </div>
    </div>
  );
}

export default App;
