import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
const Profile = () => {
  const [pics, setPics] = useState([]);
  const [editPic, setEditPic] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/myposts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPics(data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editPic) {
      const data = new FormData();
      data.append("file", editPic);
      data.append("upload_preset", "instagram-mern");
      data.append("cloud_name", "insta");
      fetch("https://api.cloudinary.com/v1_1/insta/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((result) => {
          updateImageinDB(result);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPic]);

  const updateImage = (file) => {
    setEditPic(file);
  };

  const updateImageinDB = (data) => {
    fetch("/updatepic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: data.url,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, pic: result.pic })
        );
        dispatch({
          type: "UPDATEPIC",
          payload: result.pic,
        });
      });
  };

  return (
    <>
      {state ? (
        <div
          style={{
            maxWidth: "550px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid red",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                alt=""
                src={state.pic}
              />
              <div className="file-field input-field">
                <div className="btn waves-effect waves-light">
                  <span>Update Image</span>
                  <input
                    type="file"
                    onChange={(event) => updateImage(event.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="hidden" />
                </div>
              </div>
            </div>
            <div>
              <h5>{state.name}</h5>
              <h5>{state.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{pics.length} posts</h6>
                <h6>{state.followers.length} followers</h6>
                <h6>{state.following.length} following</h6>
              </div>
            </div>
          </div>
          <div className="gallery">
            {pics.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  alt={item.title}
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
};

export default Profile;
