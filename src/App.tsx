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
        <h4 className="mt-5 text-blue-500 text-center text-2xl font-extrabold">
          Welcome
        </h4>
        <form onSubmit={handleSubmit} className="mt-8 grid justify-items-center">
          <input onChange={handleChangeUser} className="my-3 pl-2 border-2 border-yellow-400 focus:text-blue-400 placeholder-red-300 shadow-inner " type="text" id="user" name="user" placeholder="Admin" />
          <br />
          <input onChange={handleChangePass} className="mb-3 pl-2 border-2 border-yellow-400 focus:text-blue-400 placeholder-red-300 shadow-inner" type="password" id="password" name="password" placeholder="12345" />
          <br />
          <button className="p-1 rounded bg-purple-600 bg-opacity-50 hover:bg-purple-700 text-white"> Sign In </button>
        </form> 
        <p className="mt-1 text-center text-red-500"> {error} </p>
      </header>
    </div>
  );
}

export default App;
