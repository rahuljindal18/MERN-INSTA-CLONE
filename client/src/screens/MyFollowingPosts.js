import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const MyFollowingPosts = () => {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/followingPosts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likePost = async (postId) => {
    try {
      const res = await fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
        }),
      });
      const result = await res.json();
      const newposts = posts.map((post) => {
        if (post._id === result._id) {
          return result;
        } else {
          return post;
        }
      });
      setPosts(newposts);
    } catch (err) {
      console.log(err);
    }
  };

  const unlikePost = async (postId) => {
    try {
      const res = await fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
        }),
      });
      const result = await res.json();
      const newposts = posts.map((post) => {
        if (post._id === result._id) {
          return result;
        } else {
          return post;
        }
      });
      setPosts(newposts);
    } catch (err) {
      console.log(err);
    }
  };

  const postComment = async (text, postId) => {
    try {
      const res = await fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text,
          postId,
        }),
      });
      const result = await res.json();
      const newposts = posts.map((post) => {
        if (post._id === result._id) {
          return result;
        } else {
          return post;
        }
      });
      setPosts(newposts);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/delete/${postId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      const result = await res.json();
      const newposts = posts.filter((post) => {
        return post._id !== result._id;
      });
      setPosts(newposts);
    } catch (err) {}
  };

  return (
    <div className="home">
      {posts.map((post) => {
        return (
          <div key={post._id} className="card home-card">
            <h5>
              <Link
                to={
                  post.postedBy._id !== state._id
                    ? `/profile/${post.postedBy._id}`
                    : "/profile"
                }
              >
                {post.postedBy.name}
              </Link>
              {post.postedBy._id === state._id ? (
                <i
                  className="material-icons"
                  style={{ color: "red", float: "right" }}
                  onClick={() => deletePost(post._id)}
                >
                  delete
                </i>
              ) : (
                ""
              )}
            </h5>
            <div className="card-image">
              <img src={post.photo} alt="" />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {post.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => unlikePost(post._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(post._id)}
                >
                  thumb_up
                </i>
              )}

              <h6>{post.likes.length} likes</h6>
              <h6>{post.title}</h6>
              <p>{post.body}</p>
              {post.comments.length ? (
                <div>
                  <h5>Comments ({post.comments.length})</h5>
                  {post.comments.map((comment) => {
                    return (
                      <div key={comment._id}>
                        <span style={{ fontWeight: "bold" }}>
                          {comment.postedBy.name}
                        </span>
                        &nbsp;
                        <span>{comment.text}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  postComment(e.target[0].value, post._id);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyFollowingPosts;
