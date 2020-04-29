import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    const loggedinId = JSON.parse(localStorage.getItem("user"))._id;
    fetch(`/user/${userid}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const boolVal = data.user.followers.includes(loggedinId) ? false : true;
        setUserProfile(data);
        setShowFollow(boolVal);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const followUser = async () => {
    const res = await fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followerId: userid,
      }),
    });
    const result = await res.json();
    console.log(result);
    dispatch({
      type: "UPDATE",
      payload: {
        followers: result.followers,
        following: result.following,
      },
    });
    localStorage.setItem("user", JSON.stringify(result));
    setUserProfile((prevState) => {
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: [...prevState.user.followers, result._id],
        },
      };
    });
    setShowFollow(false);
  };

  const unfollowUser = async () => {
    const res = await fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowerId: userid,
      }),
    });
    const result = await res.json();
    dispatch({
      type: "UPDATE",
      payload: {
        followers: result.followers,
        following: result.following,
      },
    });
    localStorage.setItem("user", JSON.stringify(result));
    setUserProfile((prevState) => {
      const newFollowers = prevState.user.followers.filter(
        (unfollowerid) => unfollowerid !== result._id
      );
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: newFollowers,
        },
      };
    });
    setShowFollow(true);
  };

  return (
    <>
      {userProfile ? (
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
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
                {showFollow ? (
                  <button
                    className="btn waves-effect waves-light"
                    onClick={followUser}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light"
                    onClick={unfollowUser}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
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

export default UserProfile;
