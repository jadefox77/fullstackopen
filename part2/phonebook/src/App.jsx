import { useState, useEffect } from 'react'
import axios from 'axios'
import personServices from './services/personServices'
import Notification from './components/Notification'
import './index.css'


const Filter = ({ filter, handleFilterChange}) => (
    <div>
        <p>filter shown with</p><input value={filter} onChange={handleFilterChange}/>
      </div>
)


const PersonForm = ({ newName, number, handleNumberChange, handleNameChange, addName}) => (
<form onSubmit={addName}>
         <div>
          name: <input value={newName}
          onChange={handleNameChange}/>
        </div>

         <div>number: <input value={number} onChange={handleNumberChange}/></div>
        <div>
          <button  type="submit">add</button>
        </div>

      </form>
)

const Persons = ({ persons, deletePerson}) => (
  <ul>
      {persons.map(person =>(
        <li key={person.id}>
          {person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>
          delete
          </button>
          </li>
      ))}
     </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [number, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  


useEffect(() => {
  personServices
    .getAll()
    .then(initialNotes => {
      setPersons(initialNotes)
    })
}, [])

const addName = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(
    person => person.name?.toLowerCase() === newName.toLowerCase()
  )

  const personObject = {
    name: newName,
    number: number
  }

  if (existingPerson) {
    const confirmUpdate = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (!confirmUpdate) return   // ⬅️ IMPORTANT

    personServices
      .update(existingPerson.id, personObject)
      .then(returnedPerson => {
        setPersons(
          persons.map(p =>
            p.id === existingPerson.id ? returnedPerson : p
          )
        )

        setNotification({
          message: `Updated ${returnedPerson.name}`,
          type: 'success'
        })

        setTimeout(() => setNotification(null), 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({
          message: `Information of ${existingPerson.name} has already been removed from server`,
          type: 'error'
        })

        setTimeout(() => setNotification(null), 5000)

        setPersons(persons.filter(p => p.id !== existingPerson.id))
      })

  } else {
    personServices
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: 'success'
        })

        setTimeout(() => setNotification(null), 5000)

        setNewName('')
        setNewNumber('')
      })
  }
}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
const handleFilterChange = (event) => {
  setFilter(event.target.value)
}
const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

const deletePerson = (id) => {
  const person = persons.find(p => p.id === id)
  
  if(window.confirm(`Delete ${person.name}?`)){
  personServices
    .remove(id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
    })
    
}
}
  return (
    <div>
      <h2>Phonebook</h2> 
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
       
        <h3>Add a new</h3>

      <PersonForm 
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
        addName={addName}
        />
      <h2>Numbers</h2>
     <Persons 
     persons={filtered} 
     deletePerson={deletePerson}
     />

    </div>
  )
}

export default App