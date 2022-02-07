import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [image, setImage] = useState({ preview: '', data: '' })
  const [data, setData] = useState([])
  const [toggled, setToggled] = useState(false)
  const [databaseUpdated, setDatabaseUpdated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image.data)
    const response = await fetch('/personData', {
      method: 'POST',
      body: formData,
    }).then(response => response.json()).then(newData => setData(prev => [...prev, newData]))
  }

  const handleNewEntry = async (e, Img) => {
    e.preventDefault()
    console.log(document.getElementById("Who").value)
    const response = await fetch('/missingPeople', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"Who":document.getElementById("Who").value, "Img":Img}),
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
      <nav className="navbar navbar-expand-lg navbar-light bg-primary p-3">
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
      <div className="card w-25 m-3">
        {image.preview && <img src={image.preview} width='100' height='auto' className="card-img-top"/>}
        <div className="card-body">
          <div className="card-title">Submit an image</div>
            <form onSubmit={handleSubmit}>
              <input type='file' name='file' onChange={handleFileChange}></input>
              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>
        <ol className="list-group list-group-numbered list-group-flush">
          <h2 className="m-3">Previous Requests:</h2>
          {(data.length > 0) ?
            (data.map((data) =>
            (data.Found)?
            (
              <li className='list-group-item'>
                <div className="card m-3 w-25">
                  <img className="card-img-top" src={require("./"+data.Img)}/>
                  <p className="card-title">{data.Name}</p>
                </div>
              </li>
            ):(
              <li className='list-group-item'>
            <div className="card w-25 m-3">
              <img className="card-img-top" src={require("./"+data.Img)}/>
              <div className="card-title">
                <label htmlFor="Know" className="form-label">Do you know the person in the image: {data.Img}</label>
                <input type='checkbox' id='Know' onChange={(event)=>{console.log("Toggled"); setToggled(!event.target.checked)}}/>
              </div>
              {(!toggled) ?   
              ( 
                <div className="card-body">
                  <form onSubmit={event => handleNewEntry(event, data.Img)}>
                    <label htmlFor="Who" className="form-label">Who are they?</label>
                    <input type='text' id='Who'/>
                    <input type='submit'/>
                  </form>
                </div>
              ):(
                <div className="card-body">
                  <p>
                    Okay, that's fine.
                  </p>
                </div>
              )}
              {(databaseUpdated === 'All Good') ? (
                <div>
                  We've updated the database
                  <a href="localhost:3000">Restart</a>  
                </div>
              ):(<div>Complete the form</div>)}
            </div></li>))
            ):(
              <p>No completed requests yet</p>
            )}
          </ol>
    </div>
  )
}

export default App;