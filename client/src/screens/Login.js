import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { errorToast, successToast } from "../utils/utils";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postData = async () => {
    try {
      const response = await fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (data.error) {
        errorToast(data.error);
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });
        successToast("Logged in successfully");
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="btn waves-effect waves-light" onClick={postData}>
          Login
        </button>
        <h6>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;
