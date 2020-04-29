import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { errorToast, successToast } from "../utils/utils";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [picUrl, setPicUrl] = useState(undefined);

  useEffect(() => {
    if (picUrl) {
      postFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picUrl]);

  const uploadProfilePic = async () => {
    try {
      const data = new FormData();
      data.append("file", profilePic);
      data.append("upload_preset", "instagram-mern");
      data.append("cloud_name", "insta");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/insta/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await response.json();
      setPicUrl(result.url);
      // return result.url;
    } catch (err) {
      console.log(err);
    }
  };

  const postFields = async () => {
    try {
      const response = await fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: picUrl,
        }),
      });
      const data = await response.json();
      if (data.error) {
        errorToast(data.error);
      } else {
        successToast(data.message);
        history.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const postData = () => {
    if (profilePic) {
      uploadProfilePic();
    } else {
      postFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light">
            <span>Profile Pic</span>
            <input
              type="file"
              onChange={(event) => setProfilePic(event.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button className="btn waves-effect waves-light" onClick={postData}>
          Sign Up
        </button>
        <h6>
          Already have an account? <Link to="/login">Login</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
