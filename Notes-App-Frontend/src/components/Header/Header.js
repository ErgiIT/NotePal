import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../toastifyCustomStyles.css";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();

  const loginInfo = window.localStorage.getItem("userLogin");
  const roleInfo = window.localStorage.getItem("userRole");
  // converting string data to json

  const userData = JSON.parse(loginInfo);
  //console.log(userData.lastLogout);

  const userRole = JSON.parse(roleInfo);
  // console.log(userRole);

  const baseUrl = "http://localhost:5320/";

  const logoutHandler = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}api/users/logout/${userData._id}`
      );
      // console.log(response.data);

      // Delete userLogin from localstorage and then navigate to root
      localStorage.removeItem("userLogin");
      localStorage.removeItem("userRole");

      toast.success("Logout Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <ul className="container-nav">
        <li>
          <Link to="/" className="cool_transformation">
            Home
          </Link>
        </li>
        {loginInfo ? (
          <>
            <li>
              <Link to="/mynotes" className="cool_transformation">
                My Notes
              </Link>
            </li>
            {userRole === "Editor" ? (
              <li>
                <Link to="/editor" className="cool_transformation">
                  Editor View
                </Link>
              </li>
            ) : (
              <li className="empty"></li>
            )}
            {userRole === "Admin" ? (
              <li>
                <Link to="/admin" className="cool_transformation">
                  Admin View
                </Link>
              </li>
            ) : (
              <li className="empty"></li>
            )}
            <li>
              <Link
                to=""
                onClick={logoutHandler}
                className="cool_transformation"
              >
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="cool_transformation">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="cool_transformation">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
