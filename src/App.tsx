import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './App.css';
import axios from 'axios';

function App() {

  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  let history = useHistory();

  function handleChangeUser (e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handleChangePass (e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleSubmit (e: any) {
    e.preventDefault();

    axios.post("http://localhost:3001/blogadmin/login", {
      user: username,
      password: password
    })
    .then( (res) => {
      if(res.data.message !== "Auth Passed" ) { 
          setError("Wrong password or username")
      }
      else {
        localStorage.setItem('token', res.data.token);
        history.push("/posts");
      }  
    })
    .catch( (err) => {
      console.log(err)
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Happy hacking!
        </p>
        <form onSubmit={handleSubmit}>
          <input onChange={handleChangeUser} type="text" id="user" name="user" placeholder="Admin" />
          <br />
          <input onChange={handleChangePass} type="password" id="password" name="password" placeholder="12345" />
          <br />
          <button> Sign In </button>
        </form> 
        <p> {error} </p>
      </header>
    </div>
  );
}

export default App;
