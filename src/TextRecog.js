import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function TextRecog() {
    const [image, setImage] = useState({ preview: '', data: '' })
    const [data, setData] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', image.data)
        const request = await fetch('/textRecog', {
        method: 'POST',
        body: formData,
        }).then(response => response.json()).then(newData => setData(prev => [...prev, newData]))
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
            <h1 className="navbar-brand text-light">Text Recognition</h1>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <Link className="navbar navbar-link text-light" to="/">Face Recognition</Link>
            </ul>
          </nav>
          <div className="card w-25 m-3">
            {image.preview && <img src={image.preview} width='100' height='auto' className="card-img-top" alt="Preview of your text."/>}
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
                      <img className="card-img-top" alt="The text you submitted." src={require("./"+data.Img)}/>
                      <p className="card-title">{data.Text}</p>
                    </div>
                  </li>
                ):(
                    <li className='list-group-item'>
                    <div className="card m-3 w-25">
                      <img className="card-img-top" alt="The text you submitted." src={require("./"+data.Img)}/>
                      <p className="card-title">There was a problem with your request</p>
                    </div>
                  </li>))
                ):(
                  <p className="m-3">No completed requests yet</p>
                )}
              </ol>
        </div>
      )
}

export default TextRecog;