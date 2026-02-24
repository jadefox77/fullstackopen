import axios from "axios"

const baseurl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseurl).then(response => response.data)
}

const create = personObject => {
  return axios.post(baseurl, personObject)
    .then(response => response.data)
}

const remove = (id) => 
    axios.delete(`${baseurl}/${id}`)

const update = (id, newObject) =>  {
return axios.put(`${baseurl}/${id}`, newObject)
        .then(response => response.data)
}


export default { getAll, create, remove, update }
