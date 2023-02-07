import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
// import "./EditNote.css";
import { toast } from "react-toastify";
import "./../../toastifyCustomStyles.css";

const EditUser = () => {
  const navigate = useNavigate();

  const params = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //const baseUrl = "https://notes-app-backend.cyclic.app/";
  const baseUrl = "http://localhost:5320/";

  const roleInfo = window.localStorage.getItem("userRole");
  // converting string data to json

  const userRole = JSON.parse(roleInfo);

  // Firstly get the original note
  const getUser = async () => {
    const { data } = await axios.get(
      `${baseUrl}api/users/get/${params.userid}`
    );

    setName(data.name);
    setEmail(data.email);
    setRole(data.role);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "email-type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.put(
        `${baseUrl}api/users/update/${params.userid}`,
        {
          name,
          email,
          role,
        },
        config
      );
      setLoading(false);

      toast.success("User Edited", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      navigate("/admin");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.userid]);

  return (
    <>
      {userRole === "Admin" ? (
        <MainScreen name="Edit User">
          <div className="editContainer">
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {loading && <Loading></Loading>}
            <Form onSubmit={formSubmitHandler} className="formStyles">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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

export default EditUser;
