import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [image, setImage] = useState({ preview: '', data: '' })
  const [data, setData] = useState()
  const [toggled, setToggled] = useState(false)
  const [databaseUpdated, setDatabaseUpdated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image.data)
    const response = await fetch('/personData', {
      method: 'POST',
      body: formData,
    }).then(response => response.json()).then(data => setData(data))
  }

  const handleNewEntry = async (e) => {
    e.preventDefault()
    console.log(document.getElementById("Who").value)
    const response = await fetch('/missingPeople', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document.getElementById("Who").value),
    }).then(response => response.json()).then(data => setDatabaseUpdated(data))
  }

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }


  return (
    <div className='App'>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <h1 className="navbar-brand text-light">Facial Recognition</h1>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link disabled text-light" href="">Find a person</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-light" href="">People</a>
          </li>
        </ul>
      </nav>
      {image.preview && <img src={image.preview} width='100' height='100' />}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <input type='file' name='file' onChange={handleFileChange}></input>
        <button type='submit'>Submit</button>
      </form>
      {(data != null) ? 
        ((data.Found)?
        (<p>{data.Name}</p>)
        :(<div>
          <label htmlFor="Know">Do you know this person</label>
          <input type='checkbox' name='Know' onChange={(event)=>{console.log("Toggled"); setToggled(!event.target.checked)}}/>
          {(!toggled) ? 
          (
            <form onSubmit={handleNewEntry}>
              <label htmlFor="Who">Who are they?</label>
              <input type='text' id='Who'/>
              <input type='submit'/>
            </form>
          ):(
            <p>
              Okay, that's fine.
            </p>
          )}
          {(databaseUpdated === 'All Good') ? (
            <div>
              We've updated the database
              <a href="localhost:3000">Restart</a>  
            </div>
          ):(<div>Complete the form</div>)}
        </div>)
        ):(
          <p>We haven't processed your request yet.</p>
        )}
    </div>
  )
}

export default App;