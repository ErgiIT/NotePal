import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";
import { toast } from "react-toastify";
import "./../../toastifyCustomStyles.css";

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //const baseUrl = "https://notes-app-backend.cyclic.app/";
  const baseUrl = "http://localhost:5320/";

  const roleInfo = window.localStorage.getItem("userRole");
  // converting string data to json

  const userRole = JSON.parse(roleInfo);

  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const loginInfo = window.localStorage.getItem("userLogin");
      // converting string data to json
      const userData = JSON.parse(loginInfo);
      // console.log(userData._id);

      setLoading(true);
      ///
      const { data } = await axios.post(
        `${baseUrl}api/users/`,
        {
          name,
          email,
          password,
          role,
        },
        config
      );
      setLoading(false);
      // console.log(data);
      toast.success("User Created", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      navigate("/admin");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      {userRole === "Admin" ? (
        <MainScreen title="Create User">
          <div className="createContainer">
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {loading && <Loading></Loading>}
            <Form onSubmit={formSubmitHandler} className="formStyles">
              <Form.Group className="mb-3" controlId="title">
                <Form.Label className="shkrimi">Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className="titleControl"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Ram"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="content">
                <Form.Label className="shkrimi">Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  className="titleControl"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="abc@example.com"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="content">
                <Form.Label className="shkrimi">Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  className="titleControl"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="*********"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </Form.Control>
              </Form.Group>
              <div className="btnSection">
                <button
                  className="goBackButton"
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submitButton">
                  Done
                </button>
              </div>
            </Form>
          </div>
        </MainScreen>
      ) : (
        navigate("/unauthorized")
      )}
    </>
  );
};

export default CreateAdmin;
