import axios from "axios";
import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
//import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";
import "./LoginScreen.css";

import { toast } from "react-toastify";
import "./../../toastifyCustomStyles.css";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastLogin, setLastLogin] = useState(Date);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //const baseUrl = "https://notes-app-backend.cyclic.app/";
  const baseUrl = "http://localhost:5320/";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}auth`,
        {
          email,
          password,
        },
        config
      );

      // storing data into string form in local storage - JSON.stringify, cannot store it in objects
      localStorage.setItem("userLogin", JSON.stringify(data));
      //console.log(data);
      localStorage.setItem("userRole", JSON.stringify(data.role));

      //console.log(data.lastLogin);
      setLoading(false);
      setError(null);

      toast.success("Login Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });

      navigate("/mynotes");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setError(error.response.data.message);
    }
  };

  return (
    <MainScreen className="title" title="Enter your details">
      <div className="loginContainer">
        {/* {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>} */}
        {loading && <Loading />}
        <Form className="formStyles" onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="shkrimi">Email address</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="email"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="shkrimi">Password</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="password"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <button className="loginButton" type="submit">
            Login
          </button>
        </Form>

        <Row className="py-3">
          <Col className="loginCol">
            Don't have an account?
            <span>
              <Link to="/register" className="cool_transformation">
                {" "}
                Register Here
              </Link>
            </span>
          </Col>
        </Row>
        <Row className="py-3">
          <Col className="loginCol">
            Don't remember your password?
            <span>
              <Link to="/reset-password" className="cool_transformation">
                {" "}
                Reset Password
              </Link>
            </span>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default LoginScreen;
