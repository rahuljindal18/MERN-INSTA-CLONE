import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { errorToast, successToast } from "../utils/utils";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            errorToast(data.error);
          } else {
            successToast("Post created successfully");
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const uploadImageAndCreatePost = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
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
      setUrl(result.url);
      // return result.url;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "20px auto",
        width: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light">
          <span>Upload Image</span>
          <input
            type="file"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light"
        onClick={uploadImageAndCreatePost}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
