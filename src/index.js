import React from 'react';
import ReactDOM from 'react-dom';
import FaceRecog from './FaceRecog';
import TextRecog from './TextRecog';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FaceRecog/>}/>
      <Route path="textRecog" element={<TextRecog/>}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
