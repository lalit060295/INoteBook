import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login =  (props) => {
  const host = "http://localhost:5000";
  let history = useNavigate();
  
 const [credentials , setCredentials] = useState({email:"", password : ""});


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response =  await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:credentials.email,  password: credentials.password }),
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
      localStorage.setItem('token', json.authToken);
      props.showAlert("Logged in Successfully","success");
      history("/");
      
    }else
    {
      props.showAlert("Invalid details","danger");
    }
    
  }

  return (
    <div>
      <h2>Login to continue to INotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" name="email" className="form-control" id="email" onChange={onChange} value={credentials.email} aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name="password" value={credentials.password} onChange={onChange} className="form-control" id="password"/>
        </div>
        <button type="submit"  className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login
