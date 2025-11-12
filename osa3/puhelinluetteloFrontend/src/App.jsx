import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) =>// Display filterString input field
  <div>filter shown with <input value={props.value} onChange={props.onChange} /></div>

const DisplayPerson = ({ person }) => {// Display person information
  return (
    <>{person.name} {person.number} </>
  )
}

const DeleteButton = ({ onClick }) => <button onClick={onClick}>Delete</button>// Display delete button

const Persons = ({ persons, filterString, removePerson }) => {// Display phone book contents
  const personsToShow = filterString === ''
    ? persons
    : persons.filter((element) => (element.name.toLowerCase() + " " + element.number).includes(filterString.toLowerCase()))

  return (
    <div>
      {personsToShow.map(person => <div key={person.name}><DisplayPerson person={person} /><DeleteButton onClick={() => removePerson(person.id, person.name)} /></div>)}
    </div>
  )
}

const PersonForm = (props) => (// Display personForm
  <form onSubmit={props.addPerson}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({ message, isGood }) => {// Display notification
  const messageStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }
  const goodMessageStyle = { ...messageStyle, color: 'green' }
  const badMessageStyle = { ...messageStyle, color: 'red' }
  if (message === null) {
    return null
  }
  return (
    <div style={isGood ? goodMessageStyle : badMessageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])// array containing persons in phone book
  const [newName, setNewName] = useState('')// string for name field in form
  const [newNumber, setNewNumber] = useState('')// string for number field in form
  const [filterString, setFilterString] = useState('')// string for string used for filtering persons
  const [message, setMessage] = useState(null)// string for notification message
  const [isGood, setIsGood] = useState(true)// flag for whether message is good or bad

  useEffect(() => {// get initial persons from server
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {// add new person to phone book
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    console.log("personObject is:", personObject)
    if (personObject.name === "") {// name field is empty
      alert("Please enter a name.")
      return
    }
    if (personObject.number === "") {// number field is empty
      alert("Please enter a phone number.")
      return
    }
    if (persons.find((element) => element.number === personObject.number)) {// number is already in phone book
      alert(`The phone number "${personObject.number}" is already added to phonebook`)
      return
    }
    if (persons.find((element) => element.name === personObject.name)) {// person is already in phone book
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const index = persons.findIndex((element) => element.name === personObject.name)
        personService.update(persons[index].id, personObject)
          .then(response => {
            setPersons(persons.map(element => element.name === personObject.name ? response : element))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setIsGood(false)
            setMessage(`Information of ${personObject.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            personService
              .getAll()
              .then(response => setPersons(response))
            return
          })
        setIsGood(true)
        setMessage(`Changed ${personObject.name}'s number to ${personObject.number}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      return
    }

    personService// add new person to phone book
      .add(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setIsGood(false)
        setMessage(`Failed to add ${personObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        return
      })
    setIsGood(true)
    setMessage(`Added ${personObject.name}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const removePerson = (id, name) => {// remove person from phone book
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(response => {
          setPersons([...persons].filter(
            (element) => element.id !== id
          ))
        })
        .catch(error => {
          setIsGood(false)
          setMessage(`Failed to remove ${name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          return
        })
      setIsGood(true)
      setMessage(`Removed ${name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    else {
      return
    }
  }

  const handleNameChange = (event) => {// handle user changing name field
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {// handle user changing number field
    setNewNumber(event.target.value)
  }

  const handleFilterStringChange = (event) => {// handle user changing filterString field
    setFilterString(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isGood={isGood} />
      <Filter value={filterString} onChange={handleFilterStringChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterString={filterString} removePerson={removePerson} />
    </div>
  )
}

export default App