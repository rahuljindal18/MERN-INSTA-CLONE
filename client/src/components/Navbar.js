import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../context/UserContext";
import { successToast } from "../utils/utils";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    successToast("Logged out successfully");
    history.push("/login");
  };

  const fetchUsers = async (query) => {
    setSearch(query);
    const res = await fetch("/search-user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        query,
      }),
    });
    const result = await res.json();
    setSearchUsers(result.user);
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="10">
          <i data-target="modal1" className="material-icons modal-trigger">
            search
          </i>
        </li>,
        <li key="1">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="2">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="11">
          <Link to="/myFollowingPosts">My Following Posts</Link>
        </li>,
        <li key="5">
          <button className="btn #ff1744 red accent-3" onClick={logout}>
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="3">
          <Link to="/login">Login</Link>
        </li>,
        <li key="4">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/login"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search User"
            value={search}
            onChange={(event) => fetchUsers(event.target.value)}
          />
          <ul className="collection">
            {searchUsers.length
              ? searchUsers.map((user) => {
                  return (
                    <Link
                      key={user._id}
                      to={
                        user._id !== state._id
                          ? `/profile/${user._id}`
                          : "/profile"
                      }
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch("");
                      }}
                    >
                      <li className="collection-item">{user.email}</li>
                    </Link>
                  );
                })
              : ""}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
